import { SearchOutlined, AccountCircleOutlined, ConfirmationNumberOutlined, MaleOutlined, FemaleOutlined, EscalatorWarningOutlined, VpnKeyOutlined, LoginOutlined, CategoryOutlined, AdminPanelSettings, DashboardOutlined } from '@mui/icons-material';
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useRouter } from 'next/router';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { toggleSideMenu, closeSideMenu } from '../../redux/slices/ui.slices';
import Cookies from 'js-cookie';
import { actionLogOut } from '../../redux/slices/auth.slices';
import { GridCheckCircleIcon } from '@mui/x-data-grid';

type IInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

const SideMenu = () => {

    const [searchTerm, setSearchTerm] = useState('');
    
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(state=>state);
    const {sideMenu} = useAppSelector((state)=>state.ui);
    const router = useRouter();

    const sideMenuChange =()=> { dispatch(toggleSideMenu()) };

    const navigateTo =(url:string)=>{ //FUNCION DE NAVEGACION
        router.push(url);
        dispatch(closeSideMenu());
    }

    const onChange=( {target}:IInputEvent ) => setSearchTerm(target.value);
    const onKeyPress=( e:KeyboardEvent<HTMLDivElement> )=> e.key === 'Enter' && onSearchTerm();
    const onSearchTerm=()=>{
        if(searchTerm.trim().length === 0) return
        dispatch(closeSideMenu());
        return router.push(`/search/${searchTerm}`)
    }

    const onLogOut=()=>{
        dispatch( actionLogOut() );
        sideMenuChange();
    }

    
    return (
        <Drawer 
            open={sideMenu} 
            anchor='right' 
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }} 
            onClose={sideMenuChange}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                <List>
                        <ListItem>
                            <Input
                                type='text'
                                placeholder="Buscar..."
                                onKeyPress={onKeyPress}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={onSearchTerm}
                                        >
                                        <SearchOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                value={searchTerm}
                                onChange={onChange}
                            />
                        </ListItem>


                        <ListItem button onClick={()=>{navigateTo('/category/men')}}>  {/* sx={{ display: { xs: 'block', sm: 'block' } }} */}
                            <ListItemIcon>
                                <MaleOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Hombres'} />
                        </ListItem>

                        <ListItem button onClick={()=>{navigateTo('/category/women')}}>
                            <ListItemIcon>
                                <FemaleOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Mujeres'} />
                        </ListItem>

                        <ListItem button onClick={()=>{navigateTo('/category/kid')}}>
                            <ListItemIcon>
                                <EscalatorWarningOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Niños'} />
                        </ListItem>

                        <Divider sx={{my:'20px'}}/>


                        { //------------------USER SIN LOGEARSE-------------------------
                            !auth.isLoggedIn ?
                                <ListItem button onClick={()=>{ navigateTo(`/auth/login?p=${router.asPath}`) }}>
                                    <ListItemIcon>
                                        <VpnKeyOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Ingresar'} />
                                </ListItem>

                            :

                            //----------------OPCIONES USER LOGEADO----------------------------
                            <>
                                <ListItem button>
                                    <ListItemIcon>
                                        <AccountCircleOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItem>

                                <ListItem button onClick={()=> navigateTo('/orders/history')}>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItem>
                                <ListItem button onClick={onLogOut}>
                                    <ListItemIcon>
                                        <LoginOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Salir'} />
                                </ListItem>
                            </>
                            //----------------OPCIONES USER LOGEADO----------------------------
                        }


                        {//------------------OPCIONES ADMINISTRADOR---------------------------
                            auth.user?.role === 'admin'&&
                                <>
                                    <Divider sx={{my:'20px'}}/>
                                    <ListSubheader>Admin Panel</ListSubheader>

                                    <ListItem button onClick={()=>navigateTo('/admin')}>
                                        <ListItemIcon>
                                            <DashboardOutlined/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Dashboard'} />
                                    </ListItem>
                                    <ListItem button onClick={()=>navigateTo('/admin/orders')}>
                                        <ListItemIcon>
                                            <GridCheckCircleIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Ordenes'} />
                                    </ListItem>
                                    <ListItem button onClick={()=>navigateTo('/admin/products')}>
                                        <ListItemIcon>
                                            <CategoryOutlined/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Products'} />
                                    </ListItem>
                                    <ListItem button onClick={()=>navigateTo('/admin/users')}>
                                        <ListItemIcon>
                                            <AdminPanelSettings/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Usuarios'} />
                                    </ListItem>
                                </>
                        }
                    </List>
                </Box>

        </Drawer>
    )
}

export default SideMenu