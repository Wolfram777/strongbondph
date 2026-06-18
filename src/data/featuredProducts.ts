import eti from '../assets/products/eti.png'
import etbnylon from '../assets/products/etbnylon.png'
import ethp from '../assets/products/ethp.png'
import setxp from '../assets/products/setxp.png'
import wedge from '../assets/products/wedge.png'

export type FeaturedProduct = {
  name: string
  image: string
  imageRotated?: boolean
}

export const featuredProducts: FeaturedProduct[] = [
  { name: 'ETI', image: eti, imageRotated: true },
  { name: 'ETB Nylon', image: etbnylon, imageRotated: true },
  { name: 'ETHP', image: ethp },
  { name: 'SET XP', image: setxp },
  { name: 'Wedge', image: wedge },
]
