import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import NextLink from 'next/link';
import { ActiveLink } from "./ActiveLink";
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { closeSearchNavbar, openSearchNavbar, toggleSideMenu } from "../../redux/slices";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { cartFromCookies } from '../../utils/cartFromCookies';

type IInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export const Navbar = () => {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('')
  
  const { searchNavbar }= useAppSelector(state=>state.ui);
  const { quantityProducts }= useAppSelector(state=>state.payment);
  

  const sideMenuChange =()=> dispatch( toggleSideMenu() );           // function to toggle left menu

  const onSearchChange =( {target}:IInputEvent )=> setSearchTerm( target.value );   // function to set search value

  const onSearchOpen =()=>  dispatch( openSearchNavbar() );  //function to open searchNavbar

  const onSearchClose =()=>  {            //function to close searchNavbar
    dispatch( closeSearchNavbar() );
    setSearchTerm('');
  };
  
  const onSearch =()=>  searchTerm.trim().length > 1   &&   router.push(`/search/${searchTerm}`); //function to make the search
  const onKeyPress =( e:KeyboardEvent<HTMLDivElement> )=> e.key === 'Enter' && onSearch(); //function to make the search with Enter "key"



  return (
    <AppBar sx={{width:'100%'}}>
        <Toolbar sx={{width:'100%'}}>
            <NextLink href='/' passHref>
                <Link display='flex' alignItems='center' >
                    <Typography variant="h6" component="h6">Teslo |</Typography>
                    <Typography variant="h6" component="h6" sx={{ml:0.5}}>Shop</Typography>
                </Link>
            </NextLink>

            <Box sx={{flex:1}} /> {/*spacing */}
              <Box sx={{display:{xs:'none', md:'block'}}}>
                <ActiveLink href="/category/men" text="Hombres"/>
                <ActiveLink href="/category/women" text="Mujeres"/>
                <ActiveLink href="/category/kid" text="Niños"/>
              </Box>
            <Box sx={{flex:1}} /> {/*spacing */}


          {
            searchNavbar &&
            <>    {/**ÍCONO PARA CERRAR EL INPUT */}
              <IconButton aria-label="toggle password visibility" sx={{display:{xs:'none', sm:'block'}}} onClick={onSearchClose}>
                <CloseOutlinedIcon color="error" titleAccess="Cerrar"/>
              </IconButton>

              <Input
                type="text"
                placeholder="buscar"
                sx={{display:{xs:'none', sm:'block'}}}
                className='fadeIn'
                value={searchTerm}
                onChange={onSearchChange}
                autoFocus
                onKeyPress={onKeyPress}
              />
            </>
            
          }
                 {/*Si searchNavbar existe el ícono de lupa hace la búsqueda, de lo contrario muestra el input */}
            <IconButton onClick={searchNavbar ? onSearch : onSearchOpen} sx={{display:{xs:'none', sm:'block'}}} className='fadeIn'>
              <SearchOutlined />
            </IconButton>

            <NextLink href='/cart' passHref>
              <Link >
                <IconButton>
                  <ShoppingCartOutlined />
                  <Badge color="primary" badgeContent={quantityProducts}>
                  </Badge>
                </IconButton>
              </Link>
            </NextLink>
            <Button onClick={sideMenuChange}>Menú</Button>
        </Toolbar>
    </AppBar>
  )
}

 