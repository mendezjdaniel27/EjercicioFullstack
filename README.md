Candidato : Jesus Daniel Mendez Duarte 
Cargo : Desarrollador Fullstack

Prueba para Ingenierio Desarrollador Fullstack

En la prueba se usaron las siguientes tecnologias:

-Node v20
-React v18
-Express v4.18
-Postgresql v15

Pasos para ejecutar aplicacion:

-crear carpeta "nombre"
-entrar a carpeta  (cd "nombre")
-Clonar reposotorio con 

    git clone https://github.com/mendezjdaniel27/EjercicioFullstack.git

-con el cmd o terminal levantar contenedor

    docker-compose up -d

-en caso de fallar, o de que no muestren los datos, favor volver a reconstruir el contenedor con,

    docker-compose down -v (opcional)
    docker-compose up --build -d    (reconstruir contenedor)

-Listo para usar. Ingresar a

    http://localhost:5173/



    ENUNCIADO DE LA PRUEBA:

    Ejercicio Desarrollador Fullstack
Contexto del problema a resolver.
En la tabla loans contamos con la información por cliente de los préstamos solicitados, la
fecha en que se otorgó, el Monto que se le dio al cliente, el id de la sucursal y el Estado
(Pagado/Pendiente de Pago).
loans
Client Id Date_Loan Amount Status IdSucursal
911ac37c-5990-4bf8-8cf0-b51f21c8ecbe 1 2021-01-15 $37,500 Pendiente 3
911ac37c-5990-4bf8-8cf0-b51f21c8ecbe 2 2021-01-24 $725.18 Pendiente 3
911ac37c-5990-4bf8-8cf0-b51f21c8ecbe 3 2021-02-05 $1,578.22 Pendiente 3
911ac37c-5990-4bf8-8cf0-b51f21c8ecbe 4 2021-02-09 $380 Pendiente 3
8482bcae-0b2b-45bb-9012-59ec93978265 1 2021-01-12 $2,175.25 Pagado 2
8482bcae-0b2b-45bb-9012-59ec93978265 2 2021-01-18 $499.99 Pagado 2
8482bcae-0b2b-45bb-9012-59ec93978265 3 2021-01-29 $5,725.18 Pendiente 2
8482bcae-0b2b-45bb-9012-59ec93978265 4 2021-02-12 $876.13 Pendiente 2
78be3a77-698d-43ef-b113-a598eb1fb791 1 2021-02-09 $545.55 Pendiente 1
cee008ca-c715-456b-96c6-74ff9bd22dd3 1 2020-12-31 $15,220 Pagado 1
En la tabla de sucursales se cuenta con la información del nombre de la sucursal, el
porcentaje de IVA que maneja dicha sucursal.
ID Name IVA
1 Tijuana 8%
2 Nuevo Leon 16%
3 Tamaulipas 10%
En la tabla de Accounts se cuenta con el Saldo Disponible por Cliente y su Estado
(Activa/Bloqueada/Cancelada).
Accounts
Client Amount Status
911ac37c-5990-4bf8-8cf0-b51f21c8ecbe 15,375.28 Activa
8482bcae-0b2b-45bb-9012-59ec93978265 3,728.51 Bloqueada
78be3a77-698d-43ef-b113-a598eb1fb791 0 Cancelada
cee008ca-c715-456b-96c6-74ff9bd22dd3 235.28 Activa
El Monto del Pago se calcula de la siguiente forma:
Pago loans.amount + IVA Redondeado a 2
decimales
Ejercicio:
1. Realizar una aplicación en cualquier lenguaje que consistirá en 2 endpoints de los
cuales contendrá:
1.1. Un endpoint que retorne los pagos en estatus “Pendiente” añadiendo también el
cálculo de Pago de acuerdo con la tabla anterior para el atributo “amount”,
arrojando la información en un json con la siguiente estructura:
[{
 "client": '911ac37c-5990-4bf8-8cf0-b51f21c8ecbe',
 "sucursal": 'Tamaulipas'
 "id": 1,
 "amount": Pago,
}, { } …]
1.2. Crear un endpoint que tenga como objetivo recorrer la tabla de Cuentas de Débito
que están Activas, para de igual manera recorrer los pagos y realizar el cobro de los
que se encuentren en estatus “Pendiente” de la tabla de loans a manera de
proyección y considerando el cálculo del Pago para cada registro.
Retornando los registros que quedarán pendientes en un json con los siguientes
datos:
[{
 "client": '911ac37c-5990-4bf8-8cf0-b51f21c8ecbe',
 "id": 1 }, …]
2 Crear una página web usando cualquier librería o framework, que muestre la
siguiente vista
Título en Navbar: Cuentas pendientes,
logo: Cualquier imagen
Botónes “Simular pagos”, “Ejecutar Pagos”
Table o Datatable.
2.1 Se necesita mostrar en la tabla la información del ejercicio 1.1 con los encabezados:
Cliente, Sucursal, Identificador, Monto
2.2 Se necesita añadir un evento al botón “Simular pagos” que ejecute el endpoint del
ejercicio 1.2 y al finalizar exitosamente muestre una notificación visual de los pagos
que quedarán “pendientes”.
3 Se requiere una función de base de datos “ejecutar pagos”, que al momento de ser
ejecutada realice los pagos descontando de los amount correspondientes y cambie
el estatus de los pagos a “pagado” para los pagos que puedan ser liquidados.
3.1 Se necesita un endpoint que ejecute la función de “ejecutar pagos”.
3.2 Se necesita describir un método de automatización de la ejecución del entpoint del
punto 3.1 que incluya el script o configuración.
Entrega esperada:
1. Un API REST indicada en el punto 1 (requerido)
2. Un Frontend indicado en el punto 2 (requerido)
3. Una función de base de datos indicada en el punto 3.
4. Script o instrucciones para su automatización dentro del código.
5. Una copia del código en github con los dos proyectos (requerido). Compartir por
correo al reclutador el Link para descargar el repositorio.
6. Adjuntar al repositorio las indicaciones para correr y probar su proyecto. (Requerido)
7. Base de datos PostgreSQL, MySQL, SQLite, MongoDB. Compartir los scripts de base
de datos de creación, adjuntar en .zip o .rar
8. Documentación y explicación del código.
9. (opcional) Implementación en Docker o Deploys en Kubernetes.
10. Cualquier implementación adicional es tomada en cuenta (pruebas, migraciones,
seeders, etc…)