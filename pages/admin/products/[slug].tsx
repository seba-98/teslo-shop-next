import  { ChangeEvent, FC, useEffect, useState, KeyboardEvent, useRef } from 'react'
import { GetServerSideProps } from 'next'
import { CheckBoxOutlineBlank, CheckCircleOutline, DriveFileRenameOutline, ErrorOutlineOutlined, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { ICompleteProduct, IValidSize, IValidSizes, IValidType } from '../../../interfaces/shared_interfaces/products';
import { AdminLayout } from '../../../components/layouts';
import { getDataItem } from '../../../api-rest/ssg-ssr-request-functions/getData';
import { useForm } from 'react-hook-form';
import tesloApiBase from '../../../axios-tesloApi/tesloApi';
import { defaultSizes } from '../../../utils/defaultSizes';
import { Product } from '../../../api-rest/models';
import { useRouter } from 'next/router';
import { processUrl } from '../../../utils/processImageUrl';

type IValidGender = 'men' |'women' |'kid' |'unisex'

const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']


interface IFormData{
    _id?            : string,
    description     : string;
    images          : string[];
    sizes           : IValidSize[];
    slug            : string;
    tags            : string[];
    title           : string;
    type            : IValidType;
    gender          : 'men'|'women'|'kid'|'unisex';
    deletedImages  : string[];
}

interface Props {
    product: ICompleteProduct;
    method:string;
}
interface IAlerts {
    success:string[];
    error:string[];
}

const ProductAdminPage:FC<Props> = ({ product, method='PUT' }) => {

    const [someAlerts, setSomeAlerts] = useState<IAlerts>({
        success:[],
        error:[],
    });
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const inputFile = useRef<HTMLInputElement>(null);


    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
        watch,
    } = useForm(
        { 
        defaultValues: {
            ...product,
            deletedImages:[] as string[]
        } 
        });
    

    useEffect(() => {
     const subscription = watch((value, {name, type})=>{
        if(name === 'title'){
            const newSlug = value.title!
                .trim()
                .replaceAll(' ', '_')
                .replaceAll('"', '')
                .toLocaleLowerCase() || '';
            setValue('slug', newSlug , {shouldValidate:true})   
        }
      })

      return () => subscription.unsubscribe(); 
    }, [watch, setValue]);


   

    const onAddTag =(e:KeyboardEvent<HTMLDivElement | HTMLInputElement >)=>{
        const currentTags = getValues('tags');
        const target=e.target as HTMLInputElement;
        
        if(e.code === 'Space' ){

            target.value.length > 0
             && 
            target.value !== ' '
             && 
            !currentTags.includes(target.value) &&
            setValue('tags', [...currentTags, target.value.toLocaleLowerCase()], {shouldValidate:true});
            
            target.value ='';
            target.value.trim();
        }
    }
    
    const onDeleteTag = ( tag: string ) => {
        const currentTags = getValues('tags');
        const updateTags = currentTags.filter(t=> t !== tag );
        setValue('tags', updateTags, {shouldValidate:true});
    }
  
    const onChangePrice=( size:IValidSizes, value: number )=>{
        const updateSizes = getValues().sizes.map(s=>{
            if(s.value === size){
                s.price =  value < 1 ? 0 : value;
                return s
            }
            return s;
        }) 
        setValue('sizes', updateSizes);
    }
    const onChangeStock=( size:IValidSizes, value: number )=>{
        const updateSizes = getValues().sizes.map(s=>{
            if(s.value === size){
                s.inStock = value < 1 ? 0 : value;
                return s
            }
            return s;
        }) 
        setValue('sizes', updateSizes);
    }

    const onChangeSize=(size:IValidSize)=>{

        size.inStock =  size.inStock > 0 ? 0 : 1;
        
        setValue('sizes',  
        getValues('sizes').map(s=>{
            if(s.value === size.value){
                return size;
            } 
            return s;
        }),
        {shouldValidate:true});
    }
    
    
    const validateSize=( size:IValidSize )=>size.inStock < 1;

    const changeTitle=({target}:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue('title', target.value, {shouldValidate:true});

    const onImagesSelected=async({target}:ChangeEvent<HTMLInputElement>)=>{
        if(!target.files || target.files.length === 0) return;
        const currentImages = getValues('images');
        
        try {
            
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await tesloApiBase.post<{message:string}>('/admin/upload', formData);
                setValue('images', [...currentImages, data.message], {shouldValidate:true});
            }
            
        } catch (error) {
            console.log(error);
        }
        
    }

    const onDeleteImage=(img:string)=>{
        setValue('images', getValues('images').filter(e=>( 

            e !== img ? e : setValue('deletedImages',  [...getValues('deletedImages'), img]))

        ),{shouldValidate:true});
    }

    

    const onSubmit = async( formData:IFormData )=>{
            setIsSaving(true);
            if( getValues('images').length < 2){
                setSomeAlerts({...someAlerts, error:[ ...someAlerts.error, 'Al menos dos imagenes']})
                setIsSaving(false);
                return setTimeout(()=>{ setSomeAlerts({error:[], success:[]}) }, 5000)
            }        
            try {
                await tesloApiBase({ 
                    url:'/admin/products', 
                    method:method,
                    data:formData
                });
                setSomeAlerts({...someAlerts, success:[ method === 'PUT' ? 'Producto actualizado': 'Producto creado']})
                setIsSaving(false);
                setTimeout(()=>{ setSomeAlerts({error:[], success:[]}) }, 5000);

                return method === 'POST' &&  router.replace(`/product/${getValues('slug')}`); 
            } 
            catch (error) {
                setSomeAlerts({...someAlerts, error:[...someAlerts.error, 'Error al enviar']})
                setIsSaving(false);
                return setTimeout(()=>{ setSomeAlerts({error:[], success:[]}) }, 5000);
            }
    }
        
    
    

    return (
        <AdminLayout 
            title={'Producto'} 
            subtitle={ `Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form onSubmit={ handleSubmit( onSubmit ) } style={{padding:'0px 30px 30px 30px'}}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px', backgroundColor: isSaving ? 'grey' : 'secondary' }}
                        type="submit"
                        disabled={isSaving}
                        >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Título"                                  /*===========TÍTULO============= */
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                            onChange={(e)=>changeTitle(e)}
                            />

                        <TextField
                            label="Descripción"                             /*===========dESCRIPCIÓN============= */
                            variant="filled"
                            fullWidth 
                            rows={10}
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }
                        />

                           

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1, width:'100%'  }}>                {/*===========TIPO============= */}
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }
                                onChange={({target})=>setValue('type', target.value as IValidType, { shouldValidate:true })}
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                        key={ option }
                                        value={ option }
                                        control={ <Radio color='secondary' /> }
                                        label={ capitalize(option) }
                                        />
                                        ))
                                    }
                            </RadioGroup>
                        </FormControl>

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1, width:'100%' }}>
                            <FormLabel>Género</FormLabel>                   {/*===========GÉNERO============= */}
                            <RadioGroup 
                                row
                                value={ getValues().gender }
                                onChange={({target})=> setValue('gender', target.value as IValidGender, { shouldValidate:true } )}
                            >
                            {
                                validGender.map( option => (
                                    <FormControlLabel 
                                        key={ option }
                                        value={ option }
                                        control={ <Radio color='secondary' /> }
                                        label={ capitalize(option) }
                                    />
                                ))
                            }
                            </RadioGroup>
                        </FormControl>

                        <Divider sx={{ my: 1 }} />

                        <FormGroup sx={{ width:{ sm:'300px', md:'400px', lg:'100%'} }}>                     { /*===========SIZES============= */}
                            <FormLabel>Tallas</FormLabel>
                            {
                                product.sizes.map((size:IValidSize) => (
                                    <Box key={size.value}>
                                        <Box sx={{
                                            display:'flex',
                                            flexDirection:'row',
                                            justifyContent:'space-between'
                                        }}
                                        >
                                            <FormControlLabel
                                                key={size.value}
                                                control={
                                                <Checkbox
                                                    checked={ size.inStock > 0 }
                                                />
                                                }
                                                onChange={()=> onChangeSize(size) }
                                                label={ size.value } 
                                            />
                                            <TextField                              /*===========SIZE STOCK============= */
                                                label="Stock"
                                                onChange={({target})=>{
                                                    onChangeStock( size.value, Number(target.value) )
                                                }}
                                                InputProps={{inputProps:{min:0}}}
                                                type='number'
                                                value={ size.inStock }
                                                variant="filled"
                                                sx={{ mb: 1, width:'80px' }}
                                                disabled={ validateSize(size) }
                                            />
                                            <TextField                      /*===========SIZE PRICE============= */
                                                label="Precio"
                                                onChange={({target})=>{
                                                    onChangePrice( size.value, Number(target.value) )
                                                }}
                                                InputProps={{ inputProps:{min:0} }}
                                                type='number'
                                                defaultValue={ size.price }
                                                variant="filled"
                                                sx={{ mb: 1, width:'80px' }}
                                                disabled={ validateSize(size) }
                                                />
                                        </Box>
                                        <Divider />
                                    </Box>
                                ))
                            }
                        </FormGroup>
                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Slug - URL"                              /**=======SLUG========= */
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('slug', {
                                required: 'Este campo es requerido',
                                validate:(e)=> e.trim().includes(' ') ? 'No puede poner espacios en blanco' : undefined
                            })}
                            error={ !!errors.slug }
                            helperText={ errors.slug?.message }
                        />

                        <TextField                          /**=======ETIQUETAS========= */
                            label="Etiquetas"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            onKeyPress={ (e)=> onAddTag(e) }
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues().tags.map((tag) => {

                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={ () => onDeleteTag(tag)}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                                onClick={ ()=> inputFile.current?.click() }
                            >
                                Cargar imagen
                            </Button>
                            <input
                                ref={inputFile}
                                type="file"
                                style={{display:'none'}}
                                multiple
                                accept='image/png, image/gif, image/jpeg'
                                onChange={ (e)=> onImagesSelected(e) }
                             />

                            

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map( img =>{


                                     return(
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ processUrl(img) }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button 
                                                        fullWidth 
                                                        color="error"
                                                        onClick={()=> onDeleteImage(img)}
                                                    >
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )}
                                  )
                                }
                            </Grid>

                                {
                                someAlerts.error.length > 0 &&
                                someAlerts.error.map((e)=> (
                                <Chip
                                    key={e}
                                    color='error'
                                    variant='filled'
                                    icon={<ErrorOutlineOutlined/>}
                                    label={e} 
                                    sx={{mt:'100px'}}
                                />
                                ))
                                }
                                {
                                someAlerts.success.length > 0 &&
                                someAlerts.success.map((e)=> (
                                <Chip
                                    key={e}
                                    color='success'
                                    variant='filled'
                                    icon={<CheckCircleOutline/>}
                                    clickable
                                    label={e} 
                                    sx={{mt:'100px'}}
                                />
                                ))
                                }
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query as {slug:string};

    if(slug === 'new'){
        const tempProduct =  JSON.parse( JSON.stringify( new Product({
            sizes:defaultSizes,
            type:validTypes[0],
            gender:validGender[3]
        })));
        delete tempProduct._id;
        tempProduct.images=[]

        return {
            props: {
                product: tempProduct,
                method:'POST'
            }
        }
    }
    
    
    const product = await getDataItem(slug);

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            product,
            method:'PUT'
        }
    }
}


export default ProductAdminPage

