import { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estados para usuario y token
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  // Al montar el componente, cargar datos de localStorage
  useEffect(() => {
    // Obtener usuario y token guardados en localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    const tokenGuardado = localStorage.getItem("token");

    if (usuarioGuardado && tokenGuardado) {
      // Actualizar estado con datos guardados
      setUsuario(JSON.parse(usuarioGuardado));
      setToken(tokenGuardado);
    }
  }, []);

  // Función para iniciar sesión: guarda datos en localStorage y actualiza estado
  const login = (datosUsuario, token) => {
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    localStorage.setItem("token", token);
    setUsuario(datosUsuario);
    setToken(token);
  };

  // Función para cerrar sesión: limpia localStorage y estado
  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
  };

  // Proveer el contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir fácilmente el contexto de autenticación
export const useAuth = () => useContext(AuthContext);