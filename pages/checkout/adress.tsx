import { Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, Button } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { FC, useEffect } from 'react';
import { countries } from '../../utils';
import { useAppSelector, useAppDispatch } from '../../hooks/useReduxHooks';
import { useForm } from "react-hook-form";
import { isPhone } from '../../utils/validatePhone';
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { actionLoadUserPaymentData } from "../../redux/slices";
import { IUserPaymentData } from "../../interfaces/shared_interfaces";



const AdressPage:FC = () => {


    const router= useRouter();
    const dispatch= useAppDispatch();
    const {isLoggedIn, user} = useAppSelector(state=>state.auth);
    const {cart, loaded} = useAppSelector(state=>state.cart);
    // const {country} = useAppSelector(state=>state.payment);
    const{register, handleSubmit, formState:{ errors }, setValue, reset}=useForm<IUserPaymentData>();

     /*
        Llenamos el formData con el useEffect, ya que durante el desarrollo se observa que la información del user
        se carga de forma asincrona generando errores
     */

    useEffect(() => {
        if(!isLoggedIn) return;
        
        reset({
            name          :  user!.name || Cookies.get('name') || '',
            lastName      :  Cookies.get('lastName') || '',
            adress        : user!.location ||  Cookies.get('adress') || '',
            secondAdress  :  Cookies.get('secondAdress') || '',
            postalCode    :  Cookies.get('postalCode')|| '',
            country       : Cookies.get('country') || '',
            city          :  Cookies.get('city') || '',
            phoneNumber   : user!.phoneNumber || Cookies.get('phoneNumber') || '',
        })
    }, [isLoggedIn, setValue, user])
    
    useEffect(() => {
        if(loaded && cart.length < 1) router.push('/');
    }, [cart])

    const onSubmit=(data:IUserPaymentData)=>{
       dispatch( actionLoadUserPaymentData(data) );
       router.push('/checkout/summary');
    }

    
    

  return (
    <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino" >
        <>
            <Typography variant='h1' component='h1'>Dirección</Typography>

                <form onSubmit={ handleSubmit( onSubmit ) } noValidate>

                    <Grid container spacing={ 2 } sx={{mt:2}}>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Nombre'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('name',{
                                        required:'Ingrese su nombre'
                                    })
                                }
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Apellido'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('lastName',{
                                        required:'Ingrese su apellido'
                                    })
                                }
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Dirección'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('adress',{
                                        required:'Ingrese su dirección'
                                    })
                                }
                                error={!!errors.adress}
                                helperText={errors.adress?.message}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Código Postal'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('postalCode',{
                                        required:'Ingrese su código postal'
                                    })
                                }
                                error={!!errors.postalCode}
                                helperText={errors.postalCode?.message}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Dirección 2 (Opcional)'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('secondAdress')
                                }
                                error={!!errors.secondAdress}
                                helperText={errors.secondAdress?.message}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Ciudad'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('city',{
                                        required:'Ingrese su ciudad',
                                    })
                                }
                                error={!!errors.city}
                                helperText={errors.city?.message}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth >
                                <InputLabel>País</InputLabel>
                                <TextField
                                    variant="filled"
                                    select
                                    error={!!errors.country}
                                    helperText={errors.country?.message}
                                    defaultValue={countries[0]}
                                    {
                                        ...register('country',{
                                            required:'Seleccione un país'
                                        })
                                    }
                                >
                                    {
                                        countries.map(c=>(
                                            <MenuItem key={c.code} value={c.code} >{c.name}</MenuItem>
                                        ))
                                    }
                                </TextField>
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Teléfono'
                                variant='filled'
                                fullWidth
                                placeholder="+444 435522"
                                {...register('phoneNumber', {
                                    required:'Ingrese un número de teléfono válido (Incluir "+")',
                                    validate: (p)=> isPhone(p!),
                                })}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                            />
                       </Grid>
                    </Grid>


                    <Box sx={{ mt:5}} display='flex' justifyContent='center'>
                        <Button 
                            color='secondary' 
                            className="circular-btn" 
                            size="large"
                            type='submit'
                        >
                            Revisar pedido
                        </Button>
                    </Box>
                </form>

        </>
    </ShopLayout>
  )
}


export default AdressPage