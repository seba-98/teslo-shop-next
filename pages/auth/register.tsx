import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Grid, TextField, Typography, Link, Chip } from '@mui/material'
import axios from 'axios';
import NextLink from 'next/link';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import tesloApiBase from '../../axios-tesloApi/tesloApi';
import { AuthLayout } from '../../components/layouts'
import { validatePhone } from '../../utils';
import { isEmail } from '../../utils/validateEmail';

interface IFormData{
    name           :string;
    phoneNumber    :string;
    email          :string;
    password       :string;
    confirmPassword:string;
}



 const Register = () => {


    const {register, handleSubmit, reset, formState:{errors}, getValues,watch }=useForm<IFormData>();
    const [reqError, setReqError] = useState<string[]>([]);
    const {name,password, confirmPassword}= getValues()

    const removeError=()=> setTimeout(()=>{ setReqError([]) },10000)
    const matchPasswords=()=> password !== confirmPassword && setReqError(['Las contraseñas deben coincidir'])
    


    const onSubmit=async(formData:IFormData)=>{

   
        try {
            const {data} = await tesloApiBase.post('/user/register', formData);
            reset();
            
        } catch (error) {
            
            if(axios.isAxiosError(error)){

                const {errors} = error.response?.data as {errors:string[]};
                errors.length > 0 && setReqError(errors);
            }
            removeError();
            
        }

    }


    return (
        <AuthLayout title={'Registrarse'} pageDescription={'Registrar usuario'}>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Box  sx={{width:350, padding:'10px 20px', height:'calc(100vh - 500px)'}}>

                    <Grid container spacing={ 3 }>

                        <Grid item xs={ 12 }>
                            <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                        </Grid>
                            {
                                reqError.length > 0 &&
                                reqError.map(e=>(
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
                                    minLength:{value:1, message:'El nombre debe tener al menos 2 caracteres'},
                                    maxLength:{value:10, message:'El nombre puede llevar hasta 20 caracteres'},
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
                            <NextLink href='/auth/login' passHref>
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

export default Register;