import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { checkUserByEmail, checkUserEmailPassword } from '../../../api-rest/ssg-ssr-request-functions/dbNextAuthUsers';


export default NextAuth({
 
  // providers
  providers: [
    Credentials({                                                                     //custom login
      name:'Custom Login',
      credentials:{
        email:{label:'Correo:', type:'email', placeholder:'correo@gmail.com'},
        password:{label:'contraseña:', type:'password', placeholder:'contraseña'},
      },
      
      async authorize(credentials){
        return checkUserEmailPassword(credentials!.email, credentials!.password)
      }
    }),

    GithubProvider({                                                                  //github login or register
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

    GoogleProvider({                                                                  //github login or register
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],

  //custom pages
  pages:{
    signIn:'/auth/login',
    newUser:'/auth/register',
  },

  session:{
    maxAge:2592000,
    strategy:'jwt',
    updateAge:86400
  },

  //callbacks
  callbacks:{

    async jwt({token, account, user}){                           //COMPROBACIÓN  DE ACCOUNT Y TIPO DE LOGEO
                                                                //se debe definir el objeto token
      if( account ){                                            //si existe account, accessToken y access token, se llenarán con los datos
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'credentials':
            token.user = user
            break;

          case 'oauth':
            token.user = await checkUserByEmail( user?.email || '', user?.name || '' );  //aqui no deben hacerse validaciones, se confía en el provider
            break;
        
          default:
            break;
        }
      }
      return token
    },  //Esta funcion JWT envía los datos del token ya evaluados a la funcion de session


    async session({session, token, user}){ //MANEJO DEL INICIO DE SESION EN LA APLICACION
      session.accessToken = token.accessToken;
      session.user= token.user as any;
      return session      
    }
  }
})