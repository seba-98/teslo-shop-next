import { FC } from 'react'
import { Slide } from 'react-slideshow-image'
import styles from '../../styles/SlideShow.module.css'
import { processUrl } from '../../utils'

interface Props{
    images:string[]
}

export const SlideShow:FC<Props> = ({ images }) => {

    const base = process.env.CLOUDINARY_BASE_URL || '';

  return (
    <Slide
        easing='ease'
        duration={7000}
        indicators
    >
        {
            images.map(img=>{
                
                return (
                    <div className={styles['each-slide']} key={img} >
                        <div style={{
                            backgroundImage:`url(${processUrl(img)})`,
                            backgroundSize:'cover',
                        }}>

                        </div>
                    </div>
                )
            })
        }
    </Slide>
  )
}
