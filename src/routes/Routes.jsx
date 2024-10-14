import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Cadastro from '../pages/Cadastro/Cadastro';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Usuarios from '../pages/Usuarios/Usuarios';
import Destinos from '../pages/Destinos/Destinos';
import AdicionarDestinos from '../pages/Destinos/AdicionarDestinos';
import EditarDestino from '../pages/Destinos/EditarDestino';
import EditarUsuario from '../pages/Usuarios/EditarUsuario';

function AppRoutes() {

    return (
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            <Route element={<PrivateRoute />}>
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path='/editar-usuario/:id' element={<EditarUsuario/>}/>
                <Route path="/destinos" element={<Destinos />} />
                <Route path="/adicionar-destinos" element={<AdicionarDestinos />} />
                <Route path="/editar-destino/:id" element={<EditarDestino />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;