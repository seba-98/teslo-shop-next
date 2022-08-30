export const matchPhone = (phone: string): boolean => {

    if(phone ==='+0000000') return false
  
    const match = String(phone)
        .toLowerCase()
        .match(/^\+(?:[0-9] ?){6,14}[0-9]$/);
  
      return !!match;
  };
  
  export const isPhone = (phone: string): string | undefined => {
    return matchPhone(phone) 
      ? undefined
      : 'Debe ser un número de teléfono válido (incluír el +)';
  }