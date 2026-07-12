import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import {
    CreateCollectionInput,
    UpdateCollectionInput,
    AddBookInput,
} from './collection.schema'
import { Prisma } from "../../generated/prisma";


// helper interno ----------------------------------------------------
// va a verificar que la coleccion existe y pertenece al usuario en sesion
// se va ausar en varios metodos, asu que se extrae para no repetir
async function findCollectionOrFail(collectionId:number, userId: number) {
    const collection = await prisma.collection.findUnique({
        where: { id: collectionId},
    })

    if (!collection) {
        throw new ApiError(404, 'Colección no encontrada')
    }

    if (collection.userId !== userId) {
        throw new ApiError(403, 'No tenés permisos para acceder a esta colección')
    }

    return collection
}


// CREAR una colección -----------------------------------------------
export async function createCollection(
    userId: number,
    input: CreateCollectionInput
) {
    // primero se verifica que el usuario no tenga una colección con ese nombre
    // siguiendo esta logica, los nombres de colecciones deben ser unicos por usuario
    const existing = await prisma.collection.findFirst({
        where: { userId, name: input.name },
    })

    if (existing) {
        throw new ApiError(409, 'Ya existe una colección con ese nombre')
    }

    const data: Prisma.CollectionUncheckedCreateInput = {
        ...input,
        userId,
    }

    return prisma.collection.create({ data })
}


// LISTAR todas las colecciones ---------------------------------------
export async function getCollections(userId: number) {
    return prisma.collection.findMany({
        where: { userId },
        include: {   // se incluye el conteo de libros en cada coleccion
            _count: {   // _count es una herramienta de prisma que solo cuenta los elementos, no los trae todos
                select: { books: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    })
}


// OBTENER una coleccion con sus libros -------------------------------
export async function getCollectionById(userId: number, collectionId: number) {
    await findCollectionOrFail(collectionId, userId)

    return prisma.collection.findUnique({
        where: { id: collectionId },
        include: {
            books: {
                include: {
                    book:{
                        select: {   // seleccionamos los datos que se van a mostrar del libro
                            id: true,
                            title: true,
                            author: true,
                            format: true,
                            genre:true,
                            coverUrl: true,
                        },
                    },
                },
            },
        },
    })
}


// ACTUALIZAR una coleccion ------------------------------------------
export async function updateCollection(
    userId: number,
collectionId: number,
input: UpdateCollectionInput
) {
    await findCollectionOrFail(collectionId, userId)
    
    // si se cambia el nombre, primero se verifica que no sea un nombre repetido
    if (input.name) {
        const existing = await prisma.collection.findFirst({
            where: {
                userId,
                name: input.name,
                NOT: { id: collectionId },  // se excluye la coleccion actual para no compararla con su mismo nombre
            },
        })

        if (existing) {
            throw new ApiError(409, 'Ya existe una colección con ese nombre')
        }
    }

    return prisma.collection.update({
        where: { id: collectionId },
        data: input,
    })
}


// ELIMINAR una coleccion --------------------------------------------
export async function deleteCollection(userId: number, collectionId: number) {
    await findCollectionOrFail(collectionId, userId)

    // se elimina la coleccion y tambien de los registros del libro en especifico
    // los libros NO son eliminados, solamente su vinculacion con la coleccion
    await prisma.collection.delete({
        where: { id: collectionId },
    })
}


// AGREGAR un libro a una colección ----------------------------------
export async function addBookToCollection(
    userId: number,
    collectionId: number,
    input: AddBookInput
) {
    // primero verifico que la coleccion y el libro pertenezcan al mismo usuario
    await findCollectionOrFail(collectionId, userId)

    const book = await prisma.book.findUnique({
        where: { id: input.bookId },
    })

    if (!book) {
        throw new ApiError(404, 'Libro no encontrado')
    }

    if (book.userId !== userId) {
        throw new ApiError(403, 'No tenes permisos para usar este libro')
    }

    // vamos a verificar que el libro no este en la coleccion, para evitar duplicados
    const alreadyIn = await prisma.bookCollection.findUnique({
        where: {
            bookId_collectionId: {
                bookId: input.bookId,
                collectionId,
            },
        },
    })

    if (alreadyIn) {
        throw new ApiError(409, 'El libro ya está en la colección')
    }

    return prisma.bookCollection.create({
        data: {
            bookId: input.bookId,
            collectionId,
        },
    })
}


// SACAR libro de coleccion ------------------------------------------
export async function removeBookFromCollection(
    userId: number,
    collectionId: number,
    bookId: number
) {
    await findCollectionOrFail(collectionId, userId)

    // se verifica que el libro esté en la colección
    const relation = await prisma.bookCollection.findUnique({
        where: {
            bookId_collectionId: {
                bookId,
                collectionId,
            },
        },
    })

    if (!relation) {
        throw new ApiError(404, 'El libro no está en la colección')
    }

    // se va a eliminar solo el registro
    // ni el libro ni la coleccion se van a ver afectados
    await prisma.bookCollection.delete({
        where: {
            bookId_collectionId: {
                bookId,
                collectionId,
            },
        },
    })
}

