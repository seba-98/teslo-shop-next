import { SearchOutlined, AccountCircleOutlined, ConfirmationNumberOutlined, MaleOutlined, FemaleOutlined, EscalatorWarningOutlined, VpnKeyOutlined, LoginOutlined, CategoryOutlined, AdminPanelSettings } from '@mui/icons-material'
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useRouter } from 'next/router';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { toggleSideMenu, closeSideMenu } from '../../redux/slices/ui.slices';

type IInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

const SideMenu = () => {
    
  const dispatch = useAppDispatch();
  const {sideMenu} = useAppSelector((state)=>state.ui);

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');

  const sideMenuChange =()=> { dispatch(toggleSideMenu()) };

  const navigateTo =(url:string)=>{
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


                    <ListItem button>
                        <ListItemIcon>
                            <AccountCircleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
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


                    <ListItem button>
                        <ListItemIcon>
                            <VpnKeyOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Ingresar'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <LoginOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItem>


                    {/* Admin */}
                    <Divider />
                    <ListSubheader>Admin Panel</ListSubheader>

                    <ListItem button>
                        <ListItemIcon>
                            <CategoryOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Productos'} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Ordenes'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <AdminPanelSettings/>
                        </ListItemIcon>
                        <ListItemText primary={'Usuarios'} />
                    </ListItem>
                </List>
            </Box>

    </Drawer>
  )
}

export default SideMenu