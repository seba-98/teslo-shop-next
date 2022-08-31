import { GetServerSideProps } from 'next'
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { isEmail } from '../../utils';
import { IFormLogin } from '../../interfaces/client_interfaces/authInterfaces';
import { useAppSelector, useAppDispatch } from '../../hooks/useReduxHooks';
import { useRouter } from 'next/router';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { actionSetError } from '../../redux/slices';



const LoginPage = () => {
  const {auth} = useAppSelector(state=>state);
  const router = useRouter();
  const { register, handleSubmit, formState:{ errors }, reset } = useForm<IFormLogin>();
  const [providers, setProviders] = useState<any>({});
  const dispatch = useAppDispatch();

  const destination= `${router.query.p?.toString() || '/'}`;

    useEffect(() => {
        getProviders().then(prov=>{
            setProviders(prov)
        })
    }, [])

    

  const onLoginUser = async({email, password}:IFormLogin)=> {
    const signed = await signIn('credentials', {
        email,
        password,
        redirect:true,
        callbackUrl:`${destination}`
    },
    
    )

    if(signed!.error){
        dispatch( actionSetError(['Email o contraseña incorrectos']) )
    } 
  };


  return (
    <AuthLayout title={'Ingresar'} pageDescription={'Ingrese su usuario'} >

        <form onSubmit={ handleSubmit(onLoginUser) } noValidate>

            <Box sx={{width:'350px', padding:'10px 20px'}}>
                <Grid container sx={{display:'flex', flexDirection:'column'}}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Iniciar sesión</Typography>

                        {
                            auth.error &&
                            <Chip 
                                label={auth.error}
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                            />
                        }
                    </Grid>

                    <Grid item xs={12} marginY='10px'>
                        <TextField
                            type='email'
                            label='correo'
                            variant='outlined'
                            fullWidth
                            {...register('email',{
                                required:'Ingrese su email',
                                validate: isEmail
                            })}
                            error={ !!errors.email }
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    <Grid item xs={12} marginY='10px'>
                        <TextField
                            type='password'
                            label='contraseña'
                            variant='outlined'
                            fullWidth
                            { ...register('password',{
                                required:'Ingrese su contraseña',
                                minLength:{ value:6, message:'Las contraseñas tienen mínimo 6 caracteres'}

                            }) }
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </Grid>
                        

                    <Grid item xs={12} marginY='10px'>
                        <Button  
                            color='primary' 
                            className='circular-btn'  
                            fullWidth 
                            type='submit'
                            >
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={`/auth/register?p=${destination}`} passHref>
                            <Link>
                                ¿No tienes cuenta?
                            </Link>
                        </NextLink>
                        
                    </Grid>

                    <Grid item xs={12} display='flex' flexDirection='column'>
                        <Divider sx={{ width:'100%', mb: 2 }} />
                        {
                            Object.values(providers).map((p:any)=>{

                                if(p.name === "Custom Login") return

                                return( 
                                    <Button 
                                        key={p.id}
                                        variant='outlined'
                                        fullWidth
                                        color='primary'
                                        sx={{mb:1, '&:hover':{color:'white'}}}
                                        onClick={()=>{
                                            signIn(p.id)
                                        }}
                                    > 
                                        {p.name} 
                                    </Button>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </Box>

        </form>

    </AuthLayout>
  )
}



export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const session = await getSession({ req });

    const { p='/' }= query as { p:string } //query de la página de login o '/'

    if(session){
        return{
            redirect:{
                destination:p,
                permanent:false
            }
        }
    }
    return {
        props: {}
    }
}


export default LoginPage