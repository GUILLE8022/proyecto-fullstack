export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 6 caracteres
  return password && password.length >= 6;
};

export const validateMoto = (moto) => {
  const { marca, modelo, precio, cilindraje } = moto;
  
  if (!marca || !modelo || !precio || !cilindraje) {
    return false;
  }
  
  if (typeof precio !== 'number' || precio < 0) {
    return false;
  }
  
  if (typeof cilindraje !== 'number' || cilindraje < 0) {
    return false;
  }
  
  return true;
};
