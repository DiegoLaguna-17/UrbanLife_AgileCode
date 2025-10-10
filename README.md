# Urban Life ERP

## Equipo: Agile Code

| Rol             | Nombre(s)                                         | Responsabilidades                                           |
|-----------------|--------------------------------------------------|-------------------------------------------------------------|
| Scrum Master    | Adrian Ordoñez                                   | Facilitar el proceso Scrum, eliminar obstáculos y asegurar que el equipo siga las prácticas ágiles. |
| Product Owner   | Adriana Alvarez                                  | Representar las necesidades del cliente y gestionar el Product Backlog. |
| Desarrolladores | Adriana Alvarez, Adrian Gonzales, Diego Laguna, Adrian Ordoñez | Desarrollar y entregar incrementos de producto de acuerdo con los requerimientos. |
| QAs             | Adrian Ordoñez                                 | Validar cada uno de los incrementos del producto, asegurando calidad y cumplimiento de estándares. |

## Proyecto

El proyecto **Urban Life ERP** tiene como objetivo digitalizar y automatizar los procesos administrativos y operativos de la constructora UrbanLife, incluyendo la gestión de proyectos, control de inventarios, manejo de proveedores y clientes, y generación de reportes gerenciales.

## Normas del Equipo

- **Comunicación:** Utilizamos Discord para mantenernos actualizados y comunicarnos eficazmente.  
- **Reuniones:** Celebramos reuniones de Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective según el calendario acordado.  
- **Resolución de Conflictos:** Los conflictos se abordan de manera constructiva y se resuelven de forma colaborativa con la participación de todas las partes involucradas.  
- **Entrega de Trabajo:** Se espera que cada miembro del equipo entregue su trabajo dentro de los plazos establecidos y de acuerdo con la definición de "Hecho".  

## Herramientas de desarrollo y gestor de base de datos

- **Frontend:** Angular  
- **Backend/API:** Laravel (PHP)  
- **Base de datos:** PostgreSQL  
- **Control de versiones:** Git + GitHub  
- **Gestión ágil:** Trello  

## Arquitectura del Sistema

El sistema sigue una arquitectura **cliente-servidor** con separación de capas:

1. **Frontend:** Aplicación web desarrollada en Angular para la interfaz de usuario.  
2. **Backend/API:** Implementado en Laravel para la lógica de negocio y la comunicación con la base de datos.  
3. **Base de datos:** PostgreSQL para el almacenamiento relacional de la información de la constructora.  

## Base de Datos

Se utiliza **PostgreSQL** para almacenar información crítica de la constructora, incluyendo:  
- Proyectos y obras.  
- Clientes y proveedores.  
- Inventarios y materiales.  
- Empleados y roles.  
- Facturación y reportes gerenciales.  

La base de datos garantiza integridad referencial y cumplimiento de ACID, asegurando la confiabilidad y consistencia de los datos.
