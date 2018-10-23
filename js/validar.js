var alerta = false;
/*Variable global que regula el funcionamiento
                   de los mensajes window.alert evitando así los bucles infinitos en chrome*/
//LEER PRIMERO
/*La estructura de control que sigue a continuación se empleará en todas las
funciones y por ello, para no repetir código y hacer más fácil la comprensión
se explicará aquí en lugar de en cada una de ellas:

if (!alerta) {
  alert('Error, el campo ' + campo.name + ' está vacío');
  campo.style.border = "1px red solid";
  alerta = true;
  setTimeout("alerta=false", 10);
  return false;
}

La variable global alerta regula el funcionamiento de los mensajes (window.alert),
con ella evitamos los bucles infinitos debido al bug del onblur en chrome, si su valor es
false (primera iteración) lanzaremos un mensaje de error al usuario y cambiaremos
el valor de la variable global, tras esto pondremos un tiempo límite para que salga la
alerta y recolocar el valor de la variable, evitando así bucles infinitos, además
el color del borde del recuadro se cambiará a rojo*/

/*Descripción: Función destinada a evitar los bucles infinitos debido al onblur
y los window.alert() en los navegadores*/
function alertar(campo, msg) {
  if (!alerta) {
    alert(msg);
    campo.style.border = "1px red solid";
    alerta = true;
    setTimeout("alerta=false", 10);
    return false;
  }
}

/*Descripción: Función que comprueba si un campo está vacío devolviendo un false
si lo está y un true si no lo está*/
function comprobarVacio(campo) {
  if ((campo.value == null) || (campo.value.length == 0)) { /*Si el campo es nulo (sin valor) o está vacío entra en el if y retorna un false*/
    return alertar(campo, 'Error, el campo ' + campo.name + ' está vacío'); /*Alerta regula el funcionamiento de los mensajes*/
  } else { //Si el campo no está vacío pone el recuadro con el color correspondiente al css
    campo.style.border = "1px solid green";
    return true;
  }
}


/*Descripción: Función que comprueba el tamaño de un campo, si éste se excede retornará
un false, en caso contrario un true*/
function comprobarTexto(campo, size) {
  if (campo.value.length > size) { /*Si el tamaño del campo es mayor que el que delimitamos devuelve un false*/
    return alertar(campo, 'Longitud incorrecta. El atributo ' + campo.name + ' debe ser maximo ' + size + ' y es ' + campo.value.length);
  }
  campo.style.border = "1px solid green";
  return true;
}

/*Descripción: Función que comprueba un campo delimitado por un tamaño y caracteres alfabéticos*/
function comprobarAlfabetico(campo, size) {

  var expresion_regular_alfabetico
  /*Expresión regular que admite cualquier caracter alfabético barra baja, guión, punto o espacio en blanco
		 además de la letra ñ minúscula,mayúscula y los caracteres acentuados*/

  expresion_regular_alfabetico = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\_\-\.\s]+$/;
  if (expresion_regular_alfabetico.test(campo.value)) {
    /*Si el campo cumple los requisitos de la expresión regular
                                                                     comprobamos si éste es mayor que el tamaño (size), si se
                                                                     da el caso retornamos un false, si no, un true. */
    if (campo.value.length > size) {
      return alertar(campo, 'Longitud incorrecta. El atributo ' + campo.name + ' debe ser maximo ' + size + ' y es ' + campo.value.length);
    } else {
      campo.style.border = "1px solid green";
      return true;
    }
  } else { //Si el valor del campo no cumple la expresión retornamos un false
    return alertar(campo, 'Formato no admitido, introduzca únicamente caracteres alfabéticos');
  }
}

/*Descripción: Función que comprueba que un número sea entero, que se encuentre dentro
del rango delimitado por valormenor,valormayor y además que detecte si se ha
introducido una coma como carácter separador y obligue a cambiarla (o un punto)*/
function comprobarEntero(campo, valormenor, valormayor) {
  if ((campo.value >= valormenor) && (campo.value <= valormayor)) { //Si el valor del campo está dentro del rango entramos en el if
    if (isNaN(campo.value)) { //La función isNaN() nos devuelve true cuando no es un número, es decir puede ser un carácter alfabético, etc
      return alertar(campo, 'Introducir un número entero entre ' + valormenor + ' y ' +
        valormayor);
    } else { //Si el valor está dentro del campo aplicamos la función módulo para comprobar su resto y si es o no entero
      if (campo.value % 1 == 0) { //Es entero
        campo.style.border = "1px solid green";
        return true;
      } else { //Si no es entero
        return alertar(campo, 'Introducir un número entero entre ' + valormenor + ' y ' +
          valormayor);
      }
    }
  } else { //Si el valor está fuera del rango retornamos un false
    return alertar(campo, 'Introducir un número entero entre ' + valormenor + ' y ' +
      valormayor);
  }
}

/*Descripción: Función que verifica si el campo es un número decimal, además, comprueba
  el número de decimales que tenga como límite, también comprueba que
  sea mayor y menor que los parámetros. Si cumple todos los
  requisitos devuelve true, en caso contrario false.*/
function comprobarReal(campo, numerodecimales, menor, mayor) {

  var num = campo.value; //Variable que contiene el valor del campo
  var comprobar; //Variable que realiza la comprobación del número de decimales

  if (Number(num) != num) { //Verifica que el campo sea un número
    return alertar(campo, 'No has ingresado un número, emplea el punto como carácter separador');
  } else if (num % 1 == 0) { //Comprueba si es un número, que sea entero
    return alertar(campo, 'Error, introduce un número decimal con 3 dígitos.');
  } else { //Entra si es un número no entero
    comprobar = num * (10 ** numerodecimales);
    /*Multiplica el valor del campo por 10 elevado al numero de decimales
                                                    para desplazar la coma*/
    if (comprobar % 1 == 0) { //Comprueba si existen decimales a la derecha de la coma
      if (num > menor && num < mayor) {
        //Comprueba que el campo esté dentro del límite
        campo.style.border = "1px solid #ccc";
        return true;
      } else {
        return alertar(campo, 'Número fuera de rango.');
      }
    } else {
      return alertar(campo, 'Ha ingresado demasiados decimales.');
    }
  }
}

/*Descripción: Función que comprueba un DNI evitando el campo vacío y los errores de
formato (por tamaño o por caracteres erróneos) además de comprobar que la letra
introducida corresponda con el número*/
function comprobarDni(campo) {
  var numero //Variable que contendrá el número del DNI
  var letr //Variable que contendrá la letra introducida del DNI
  var letra //Variable que contendrá la letra correcta del DNI
  var expresion_regular_dni //Expresión regular que valida el DNI con 8 dígitos y una letra

  expresion_regular_dni = /^\d{8}[a-zA-Z]$/;

  if (expresion_regular_dni.test(campo.value)) {
    /*Si el valor del campo se corresponde con la expresión entramos
                                                           y comprobamos que la letra se corresponde, de no ser así retornamos false*/
    numero = campo.value.substr(0, campo.value.length - 1);
    letr = campo.value.substr(campo.value.length - 1, 1);
    numero = numero % 23;
    letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
    letra = letra.substring(numero, numero + 1);
    if (letra != letr.toUpperCase()) {
      return alertar(campo, 'Dni erroneo, la letra del NIF no se corresponde');
    } else { //Si la expresión se cumple y la letra se corresponde retornamos true
      campo.style.border = "1px solid green";
      return true;
    }
  } else { //Si el formato no se corresponde retornamos false
    return alertar(campo, 'Dni erróneo, formato no válido');
  }
}

/*Descripción: Función que comprueba un teléfono de formas internacionales variadas y de la
forma nacional evitando vacíos, caracteres incorrectos y caracteres fuera de rango*/
function comprobarTelf(campo) {

  var expresion_regular_telefono_inter
  var expresion_regular_telefono_inter2
  var expresion_regular_telefono_inter3
  var expresion_regular_telefono_inter4
  /*Expresiones regulares que validan el teléfono internacional
		                                 de las formas: +DD DDDDDDDDD
																		                +DDDDDDDDDDD
																										00 DD DDDDDDDDD
																										00DDDDDDDDDDD*/

  var expresion_regular_telefono_nac
  /*Expresión regular que valida el teléfono nacional
																 		       de la forma: DDDDDDDDD*/

  expresion_regular_telefono_inter = /[\+]\d{2} \d{3}\d{3}\d{3}$/;
  expresion_regular_telefono_inter2 = /[\+]\d{2}\d{3}\d{3}\d{3}$/;
  expresion_regular_telefono_inter3 = /00 \d{2} \d{3}\d{3}\d{3}$/;
  expresion_regular_telefono_inter4 = /00\d{2}\d{3}\d{3}\d{3}$/;
  expresion_regular_telefono_nac = /^[9|6|7][0-9]{8}$/;
  if ((expresion_regular_telefono_inter.test(campo.value) == true) ||
    (expresion_regular_telefono_inter2.test(campo.value) == true) ||
    (expresion_regular_telefono_inter3.test(campo.value) == true) ||
    (expresion_regular_telefono_inter4.test(campo.value) == true) ||
    (expresion_regular_telefono_nac.test(campo.value) == true)) { //Si el valor de teléfono coincide con alguna de las expresiones retorna true
    campo.style.border = "1px solid #ccc";
    return true;
  } else { //Si el valor del campo no coincide retorna false
    return alertar(campo, 'Teléfono erróneo, formato no válido');
  }
}

/*Descripción: Función que comprueba un email basándose en una expresión regular verificadora
(de forma simplificada) del estándar RFC2822 para la codificación de emails*/
function comprobarEmail(campo) {
  var expresion_regular_email
  /*Expresión regular que valida un email de forma
                               simplificada según el estándar RFC2822*/
  expresion_regular_email = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (expresion_regular_email.test(campo.value)) { //Si el valor del campo coincide con la expresión retorna true
    campo.style.border = "1px solid #ccc";
    return true;
  } else { //Si el email no coincide retorna false
    return alertar(campo, 'Email incorrecto');
  }
}

/*Descripción: Función que comprueba que el login de un usuario cumpla la expresión
regular, evitando así el uso de ciertos caracteres*/
function comprobarLogin(campo) {
  var expresion_regular_login
  expresion_regular_login = /^[A-Za-z\d_]{6,25}$/;
  /*Expresión regular para validar el usuario que permite
                                              todas las letras mayúsculas y minúsculas, además de todos
                                              los dígitos y la barra baja*/

  if (expresion_regular_login.test(campo.value)) { //Si la expresión regular coincide entramos en el if y retornamos true
    campo.style.border = "1px solid #ccc";
    return true;
  } else { //Si la expresión no coincide lazamos el alert y retornamos false
    return alertar(campo, 'Error, el login solo puede contener mayúsculas,minúsculas,dígitos o barra baja de tamaño mínimo 6 y máximo 25');
  }
}

/*Descripción: Función que comprueba una contraseña en función de la
expresión regular, si cumple los requisitos retorna un true, en caso contrario
retorna un false*/
function comprobarPassword(campo) {
  var expresion_regular_password
  /*Expresión regular que valida la contraseña, para ello, ésta debe tener:
                                   al menos una letra mayúscula,una letra minúscula, un número o caracter especial,
                                   una longitud mínima de 8 caracteres, una longitud máxima de 20 caracteres.*/

  expresion_regular_password = /(?=^.{8,20}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  if (expresion_regular_password.test(campo.value)) { //Comprueba que el valor del campo se ajuste a la expresión
    campo.style.border = "1px solid green";
    return true;
  } else { //Si no se ajusta nos muestra el alert
    return alertar(campo, 'La contraseña debe tener al menos: una letra mayúscula, una letra minúscula, un número o caracter especial y una longitud comprendida entre 8 y 20 caracteres.');
  }
}
/*Descripción: Función final que se ejecuta en el onsubmit que comprueba
que los valores de los campos sean correctos para enviarlos al formulario, en
caso contrario no los enviará dándonos el motivo*/
function finalOnSubmit(c1, c2, c3, c4, c5, c6, c7) {
  if (comprobarAlfabF(c1, 25) && comprobarAlfabF(c2, 50) && comprobarEmailF(c3, 50) && comprobarAlfabF(c4, 60) &&
    comprobarVacio(c5) && comprobarLoginF(c6) && comprobarPasswordF(c7))
  {
    return true;
  }
  else {
    return false;
  }
}

/*Descripción: Funcion finale ya comentada anteriormente que se realiza
para facilitar la comprensión del apartado onblur en el archivo HTML*/
function comprobarAlfabF(campo, tamaño) {
  return comprobarVacio(campo) && comprobarAlfabetico(campo) && comprobarTexto(campo, tamaño);
}

/*Descripción: Funcion finale ya comentada anteriormente que se realiza
para facilitar la comprensión del apartado onblur en el archivo HTML*/
function comprobarEmailF(campo, tamaño) {
  return comprobarVacio(campo) && comprobarEmail(campo) && comprobarTexto(campo, tamaño);
}

/*Descripción: Funcion finale ya comentada anteriormente que se realiza
para facilitar la comprensión del apartado onblur en el archivo HTML*/
function comprobarLoginF(campo) {
  return comprobarVacio(campo) && comprobarLogin(campo);
}

/*Descripción: Funcion finale ya comentada anteriormente que se realiza
para facilitar la comprensión del apartado onblur en el archivo HTML*/
function comprobarPasswordF(campo) {
  return comprobarVacio(campo) && comprobarPassword(campo);
}
