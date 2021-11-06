import e from 'express';
import express from 'express'
import { register, login, logout, isAuthenticated, Departamento, eliminarDepartamento,ActulizarDepartamento,empleado, eliminarEmpleado, ActulizarEmpleado} from '../controllers/authController.js'
const router = express.Router()
import con from '../database/connection.js'
var departamentos = [];
var empleados = []
var editarDepas = [];
var editarEmpleados = [];
//Elabora la consulta 
con.query("SELECT * FROM departamento WHERE Activo = 1;", async(err, result) =>{
    if (err) {
        departamentos = [];
    } else {

     departamentos = result;
    }})

    con.query(" SELECT E.id,D.nombre as 'departamento',E.nombre,E.correo,E.telefono FROM empleados as E INNER JOIN departamento as D ON E.idDepartamento = D.id ;", async(err, result) =>{
        if (err) {
            empleados = [];
        } else {
            empleados = result;
        }})
// rutas para las vistas
router.get('/', isAuthenticated, async(req, res) => { 
    res.render('index', {user: req.session.user})
    res.render('departamento')
})
//get cargar
router.get('/login', (req, res) => {
    res.render('login')

})
router.get('/logout', logout);
//get registrar
router.get('/register', async(req, res) => {
    res.render('register')
})
//get agregar productos
router.get('/agregarDepartamento', async(req, res) => {
    res.render('agregarDepartamento')
    res.render('departamento')
})
//obtener los depártamentos
router.get('/departamento', async(req, res) => {
    con.query("SELECT * FROM departamento WHERE Activo = 1;", async(err, result) =>{
        if (err) {
            departamentos = [];
        } else {

         departamentos = result;
        }})
    res.render('departamento',{datos:departamentos})
})

//Eliminar Departamento
router.get('/departamento:id/eliminar', async(req, res) =>{
    var regex = /(\d+)/g

    con.query('UPDATE departamento SET Activo = 0 WHERE id = ?',Number(req.params.id.match(regex)[0]), async(err, result) => {
        if (err) {
            console.log('Ocurrio un  un error al Eliminar el Departamento')
            return
        }
        console.log("se elimino el departamento");
        console.log()
        res.redirect('/departamento')
        res.render('departamento',{datos:departamentos})
    })
}
);

//editar Departamento
router.get('/departamento:id/editar', async(req, res) =>{
    var regex = /(\d+)/g

    con.query('Select * From departamento WHERE id = ?',Number(req.params.id.match(regex)[0]), (err, result) => {
        if (err) {
            console.log('Ocurrio un al obtener el Departamento')
            return
        }
        else
        {
            editarDepas = result;
            //Renderiza el get de editar para llevar los datos
            router.get('/editarDepartamentos',async(req, res) => {
                res.render('editarDepartamentos',{editar:editarDepas})
            })
            res.redirect('/editarDepartamentos')
        }
    })
}
);


//obtener Empleados
router.get('/empleados', async(req, res) => {
    con.query(" SELECT E.id,D.nombre as 'departamento',E.nombre,E.correo,E.telefono FROM empleados as E INNER JOIN departamento as D ON E.idDepartamento = D.id ;", async(err, result) =>{
        if (err) {
            empleados = [];
        } else {
            empleados = result;
        }})
    res.render('empleados',{datos:empleados})
})
//Eliminar empleado
router.get('/empleados:id/eliminar', async(req, res) =>{
    var regex = /(\d+)/g

    con.query('DELETE FROM empleados WHERE id = ?',Number(req.params.id.match(regex)[0]), async(err, result) => {
        if (err) {
            console.log('Ocurrio un  un error al Eliminar el Empleado')
            return
        }
        console.log("se elimino el Empleado");
        res.redirect('/empleados')
        res.render('empleados',{datos:empleados})
    })
}
);
//get de agregar Empleado
router.get('/agregarEmpleados',(req, res) => {
    res.render('agregarEmpleados',{datos:departamentos})
})
//editar Empleado
router.get('/empleados:id/editar', async(req, res) =>{
    var regex = /(\d+)/g

    con.query('Select * From empleados WHERE id = ?',Number(req.params.id.match(regex)[0]), (err, result) => {
        if (err) {
            console.log('Ocurrio un al obtener el Empleado')
            return
        }
        else
        {
            editarEmpleados = result;
            console.log(editarEmpleados);
            //Renderiza el get de editar para llevar los datos
            router.get('/editarEmpleados',async(req, res) => {
                res.render('editarEmpleados',{editar:editarEmpleados ,datos:departamentos})
            })
            res.redirect('/editarEmpleados')
        }
    })
}
);




// rutas para los controllers
router.post('/register', register)
router.post('/login', login)

router.post('/agregarDepartamento',Departamento)
router.post('/editarDepartamentos',ActulizarDepartamento);

router.post('/agregarEmpleados', empleado);
router.post('/editarEmpleados', ActulizarEmpleado);

export default router
