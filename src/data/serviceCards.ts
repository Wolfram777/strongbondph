import anchorSystems from '../assets/services/anchor_systems.png'
import concreteRepair from '../assets/services/concrete_repair.png'
import crackRepairServices from '../assets/services/crack_repair_services.png'
import fiberglassJacketing from '../assets/services/fiberglass_jacketing.png'
import fiberReinforcementPolymers from '../assets/services/fiber_reiforcement_polymers.png'

export type ServiceCard = {
  label: string
  image: string
  description: string
}

export const serviceCards: ServiceCard[] = [
  {
    label: 'ANCHOR SYSTEMS',
    image: anchorSystems,
    description:
      'We offer a full array of mechanical and adhesive anchors for concrete and masonry applications.',
  },
  {
    label: 'CONCRETE REPAIR',
    image: concreteRepair,
    description:
      'We not only repair concrete defects, but we restore your concrete using the multitude of products and methodologies at our disposal.',
  },
  {
    label: 'CRACK REPAIR SERVICES',
    image: crackRepairServices,
    description:
      'We provide injection epoxies and services across a wide array of Cost and Volume.',
  },
  {
    label: 'FIBERGLASS JACKETING',
    image: fiberglassJacketing,
    description:
      'The Philippines, being an Archipelagic Nation, is no stranger to harsh saline degradation of various ports, jetties, and other marine structures.',
  },
  {
    label: 'FIBER REINFORCEMENT POLYMERS',
    image: fiberReinforcementPolymers,
    description:
      'We cater a full range of FRP Products (Carbon, E-Glass, Aramid) for the structural reinforcement of concrete, masonry, and timber structures in need of repair or upgrade.',
  },
]
