import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Grid, TextField, Typography, Link, Chip } from '@mui/material'
import NextLink from 'next/link';
import React from 'react'
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts'
import { validatePhone } from '../../utils';
import { isEmail } from '../../utils/validateEmail';
import {  IFormRegister } from '../../interfaces/client_interfaces/authInterfaces';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { actionRegister } from '../../redux/slices';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';



 const Register = () => {

     const dispatch = useAppDispatch();  
     const {auth} = useAppSelector(state=>state);

    const {register, handleSubmit, formState:{errors}, watch }=useForm<IFormRegister>();
    const router = useRouter();

    const destination = router.query.p?.toString() || '/'; 

    const onSubmit=(formData:IFormRegister)=> {

        dispatch( actionRegister(formData, destination) );
        
        // router.replace(destination)
    };

  
    

    return (
        <AuthLayout title={'Registrarse'} pageDescription={'Registrar usuario'}>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Box  sx={{width:350, padding:'10px 20px', height:'calc(100vh - 500px)'}}>

                    <Grid container spacing={ 3 }>

                        <Grid item xs={ 12 }>
                            <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                        </Grid>
                            {
                                auth.error && typeof(auth.error) !== 'string' &&

                                auth.error.map(e=>(
                                    <Chip 
                                        key={e}
                                        label={e}
                                        color='error'
                                        icon={ <ErrorOutline /> }
                                        className='fadeIn'
                                        sx={{my:'10px'}}
                                    />
                                    ))
                                }


                        <Grid item xs={ 12 }>
                            <TextField
                            label='Nombre'
                            variant='outlined'
                            fullWidth
                            {...register('name',{
                                required:'Escriba su nombre de usuario',
                                minLength:{value:1, message:'El nombre debe tener al menos 2 caracteres'},
                                maxLength:{value:10, message:'El nombre puede llevar hasta 20 caracteres'},
                                
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            />
                        </Grid>

                        <Grid item xs={ 12 }>
                            <TextField
                                label='Teléfono'
                                variant='outlined'
                                placeholder='+2244345611(ejemplo)'
                                type='tel'
                                fullWidth
                                
                                {...register('phoneNumber',{
                                    required:'El teléfono es requerido',
                                    validate:validatePhone.isPhone,
                                })}
                                error={ !!errors.phoneNumber }
                                helperText={errors.phoneNumber?.message}
                            />
                        </Grid>

                        <Grid item xs={ 12 }>
                            <TextField
                                label='email'
                                variant='outlined'
                                type='email'
                                fullWidth
                                
                                {...register('email',{
                                    required:'El email es requerido',
                                    validate:isEmail,
                                })}
                                
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid item xs={ 12 }>
                            <TextField
                                label='Contraseña'
                                variant='outlined'
                                type='password'
                                fullWidth

                                {...register('password',{
                                    required:'La contraseña es requerida',
                                    minLength:{value:6, message:'La contraseña debe tener al menos 6 caracteres'},
                                    maxLength:{value:10, message:'La contraseña puede llevar hasta 20 caracteres'},
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                />
                        </Grid>

                        <Grid item xs={ 12 }>
                            <TextField
                                label='Confirmar contraseña'
                                variant='outlined'
                                type='password'
                                fullWidth
                                {...register('confirmPassword' ,{
                                        required:'Vuelva a escribir su contraseña',
                                        minLength:{value:6, message:'La contraseña debe tener al menos 6 caracteres'},
                                        maxLength:{value:10, message:'La contraseña puede llevar hasta 20 caracteres'},
                                        validate: (val: string) => {
                                            if (watch('password') != val) {
                                                return "Las contraseñas no coinciden";
                                            }
                                        }   
                                    })
                                }
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                />
                        </Grid>

                        <Grid item xs={ 12 }>
                            <Button
                            color='secondary'
                            className='circular-btn'
                            fullWidth
                            type='submit'
                            >
                                Registrarse
                            </Button>
                        </Grid>

                        <Grid item xs={ 12 } display='flex' justifyContent='end'>
                            <NextLink href={ `/auth/login?p=${destination}` } passHref>
                                <Link >
                                    ¿Ya tienes una cuenta?
                                </Link>
                            </NextLink>
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

export default Register;