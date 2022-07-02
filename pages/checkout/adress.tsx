import { Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, Button } from "@mui/material"
import { ShopLayout } from "../../components/layouts"


const AdressPage = () => {
  return (
    <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino" >
        <>
            <Typography variant='h1' component='h1'>Dirección</Typography>

            <Grid container spacing={ 2 } sx={{mt:2}}>

                <Grid item xs={12} sm={6}>
                    <TextField  label='Nombre' variant='filled' fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField  label='Apellido' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField  label='Dirección' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField  label='Código Postal' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField  label='Dirección 2 (Opcional)' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField  label='Ciudad' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth >
                        <InputLabel>País</InputLabel>
                        <Select
                            variant="filled"
                            value={1}
                        >
                            <MenuItem value={1}>Bolivia</MenuItem>
                            <MenuItem value={2}>Argentina</MenuItem>
                            <MenuItem value={3}>Perú</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField  label='Teléfono' variant='filled'  fullWidth type='number'/>
                </Grid>
            </Grid>

            <Box sx={{ mt:5}} display='flex' justifyContent='center'>
                <Button color='secondary' className="circular-btn" size="large">
                    Revisar pedido
                </Button>
            </Box>
        </>
    </ShopLayout>
  )
}

export default AdressPage