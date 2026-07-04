// Extensión de tipos (declaration merging)

import { Role } from "../generated/prisma"  // Importa el enum de Roles (admin o user)

declare global { // Aplica al scope global 
    namespace Express {  // con el namespace se accede al espacio de nombres donde Express define sus tipos
        interface Request {  // Dentro del namespace se accede a la interface de Request (propia de Express)
            user?: {   // user puede ser opcional porque no todos los request van a tener un usuario (por ej. rutas públicas)
                id: number   // se define la forma del objeto
                role: Role
            }
        }
    }
}