import { ErrorOutlineOutlined, PeopleAltOutlined } from '@mui/icons-material';
import { Chip, Grid, MenuItem, Select, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import tesloApiBase from '../../axios-tesloApi/tesloApi';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { FullScreenLoading } from '../../components/ui';
import { IUser, IRole } from '../../interfaces/server_interfaces/user';

interface IData{
    users:IUser[]
}

const Users:NextPage = () => {

    const { data, error } = useSWR<IData>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);
    const [changeUserAlert, setChangeUserAlert] = useState(false);

    useEffect(() => {
      if(data) setUsers(data!.users);
    }, [data])
    

    if( !data && !error ){
        return <FullScreenLoading  />
    }
    
    if( error ){
        console.log(error);
        return <Typography variant='h2' component='h2'>Error al cargar</Typography>
    }



    const changeRole=async(role:IRole, userId:string)=>{

        const updateUsers = users.map((user)=>user._id === userId ? { ...user, role:role} : user);
        
        try {
            const change = await tesloApiBase.put('/admin/users', { role, userId });
            setUsers(updateUsers);
            
        } catch (error) {
            console.log(error);
            setUsers(users);
            setChangeUserAlert( true );
            setTimeout(()=>{ setChangeUserAlert( false ) }, 8000)
        }
    }

    const rows= users.map((user, idx)=>(
        {
            id:         idx + 1,
            userId:     user._id,
            name:       user.name,
            email:      user.email,
            phoneNumber:user.phoneNumber,
            role:       user.role
        }
    ))
    
    

    const columns: GridColDef[] = [
        {field:'id',headerName:'ID', width:300},
        {field:'name',headerName:'Nombre', width:300},
        {field:'email',headerName:'Email', width:300},
        {field:'phoneNumber',headerName:'Teléfono', width:300},
        {
            field:'role',
            headerName:'Rol', 
            width:350,
            renderCell:({row}:GridValueGetterParams)=>{
                
                return (
                    <Select value={ row.role }
                        label='Rol'
                        sx={{width:'300px'}}
                    >
                        <MenuItem 
                            value='admin' 
                            onClick={ ()=> changeRole('admin', row.userId ) }
                        >
                            Administrador
                        </MenuItem>

                        <MenuItem 
                            value='client'
                            onClick={ ()=> changeRole('client', row.userId ) }
                        >
                            Cliente
                        </MenuItem>
                    </Select>
                )
            }
        },
    ]

       
    
  return (
    <AdminLayout 
        title='Usuarios' 
        subtitle='Mantenimiento' 
        icon={ <PeopleAltOutlined /> }
    >
        <Grid container>
            <Grid item sx={{ height:650, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />
            </Grid>
            <Grid item sx={{
                width:'100%', 
                display: changeUserAlert ? 'flex' : 'none', 
                justifyContent:'space-around'
            }}
            className='fadeIn'
            >
                <Chip
                    color='error'
                    label='Error al actualizar usuario'
                    icon={<ErrorOutlineOutlined/>}
                />
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default Users