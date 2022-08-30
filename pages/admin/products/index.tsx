import { AddOutlined, CategoryOutlined, ErrorOutlineOutlined } from '@mui/icons-material';
import { Grid, Chip, Typography, Button, Link, Box } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr';
import { AdminLayout } from '../../../components/layouts';
import { FullScreenLoading } from '../../../components/ui';
import { ICompleteProduct } from '../../../interfaces/shared_interfaces';
import { deleteProduct, findSize, price } from '../../../utils';
import Image from 'next/image';
import NextLink from 'next/link';

interface IData{
    products:ICompleteProduct[]
}


const ProductsPage:NextPage= () => {
    
    const { data, error } = useSWR<IData>('/api/admin/products');
    const [products, setProducts] = useState<ICompleteProduct[]>([]);
    


    useEffect(() => {
        if(data) setProducts(data!.products);
      }, [data])
      
      if( !data && !error ){
          return <FullScreenLoading  />
      }
      if( error ){
          console.log(error);
          return <Typography variant='h2' component='h2'>Error al cargar</Typography>
      }


    
    const rows= products.map((product, idx)=>(
        {
            productId: product._id,
            id:idx+1,
            slug:product.slug,
            img:product.images[0],
            title:product.title,
            gender:product.gender,
            type:product.type,
            XS:findSize(product, 'XS'),
            S:findSize(product, 'S'),
            M:findSize(product, 'M'),
            L:findSize(product, 'L'),
            XL:findSize(product, 'XL'),
            XXL:findSize(product, 'XXL'),
            XXXL:findSize(product, 'XXXL'),
        }
    ))


    const columns: GridColDef[] = [
        {
            field:'img',headerName:'Foto',
            renderCell:(({row}:GridValueGetterParams)=>(
                <NextLink passHref href={`/product/${row.slug}`}>
                    <Link >
                        <Image alt='Product image' src={`/products/${row.img}`} width={100} height={100} />
                    </Link>
                </NextLink>
            ))
        },
        {
            field:'title',
            headerName:'Nombre', 
            width:300, 
            description:'Modificar producto',
            renderCell:(({row}:GridValueGetterParams)=>(
                <NextLink passHref href={`/admin/products/${row.slug}`}>
                    <Link sx={{color:'blueviolet'}} underline='always'>
                     <Typography variant='button' component='span'>{row.title}</Typography>
                    </Link>
                </NextLink>
            ))
        },
        {field:'gender',headerName:'Género'},
        {field:'type',headerName:'Tipo'},
        {field:'XS',headerName:'XS', width:250},
        {field:'S',headerName:'S', width:250},
        {field:'M',headerName:'M', width:250},
        {field:'L',headerName:'L', width:250},
        {field:'XL',headerName:'XL', width:250},
        {field:'XXL',headerName:'XXL', width:250},
        {field:'XXXL',headerName:'XXXL', width:250},
        {field:'delete',headerName:'Eliminar', width:250,
        renderCell:(({row}:GridValueGetterParams)=>(
            <Button color='error' onClick={()=>{
                deleteProduct(row.productId);
                setProducts( products.filter(p=> p._id !== row.productId) )
            }  }>Eliminar</Button>
        ))
        },
    ]


  return (
    <AdminLayout title='Products' subtitle='Mantenimiento' icon={<CategoryOutlined />}>
        <>
            <Box sx={{display:'flex', justifyContent:'end', m:2}}>

                <Button
                    startIcon={<AddOutlined />}
                    color='secondary'
                    href='/admin/products/new'
                >
                    Crear producto
                </Button>

            </Box>

            <Grid container sx={{p:2}}>
                <Grid item sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>
        </>

    </AdminLayout>
  )
}

export default ProductsPage;