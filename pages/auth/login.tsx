import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import axios from 'axios';
import NextLink from 'next/link';
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { tesloApi } from '../../axios-tesloApi';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { validateEmail } from '../../utils';


// enum GenderEnum {
//     female = "female",
//     male = "male",
//     other = "other"
// }
interface IFormData {
    email: string;
    password: string;
  }




const LoginPage = () => {

    
  const { register, handleSubmit, formState:{ errors }, reset } = useForm<IFormData>();
  const [reqError, setReqError] = useState<boolean | string>(false);

  const removeError=()=> setTimeout(()=>{ setReqError(false) },10000)
    

  const onLoginUser = async(formData:IFormData)=> {

    try {
        const { data } = await tesloApi.post('/user/login', formData);
        reset()

    } catch (error) {

        if(axios.isAxiosError(error)){
            let {message} = error.response?.data as {message:string};
            setReqError( message );
            removeError()
        }
    }


  }



  return (
    <AuthLayout title={'Ingresar'} pageDescription={'Ingrese su usuario'} >

        <form onSubmit={handleSubmit(onLoginUser)} noValidate>

            <Box sx={{width:'350px', padding:'10px 20px'}}>
                <Grid  container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Iniciar sesión</Typography>

                        {
                            reqError &&
                            <Chip 
                                label={reqError}
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                            />
                        }
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            type='email'
                            label='correo'
                            variant='outlined'
                            fullWidth
                            {...register('email',{
                                required:'Ingrese su email',
                                validate: validateEmail.isEmail
                            })}
                            error={ !!errors.email }
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
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
                        

                    <Grid item xs={12}>
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
                        <NextLink href='/auth/register' passHref>
                            <Link>
                                ¿No tienes cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>

        </form>

    </AuthLayout>
  )
}

export default LoginPage