import React from 'react';
import { UserContext } from './ManejoDatos';

// Esta pequeña funcion se encarga de obtener UserContext de /ManejoDatos
// y con eso, tomar el usuario y el token del usuario registrado
// para posteriormente entregarselo a cargaAcademica, ya que requiere el token
// y el rut del usuario para la obtencion de su carga academica.

const ManeTokens = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <UserContext.Consumer>
          {({ user, token }) => (
            <WrappedComponent
              {...this.props}
              user={user} // Pasar el usuario como props
              token={token} // Pasar el token como props
            />
          )}
        </UserContext.Consumer>
      );
    }
  };
};

export default ManeTokens;
