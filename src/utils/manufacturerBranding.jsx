import toyotaLogo from '../assets/brand-logos/toyota.svg';
import hondaLogo from '../assets/brand-logos/honda.svg';
import fordLogo from '../assets/brand-logos/ford.svg';
import chevroletLogo from '../assets/brand-logos/chevrolet.svg';
import bmwLogo from '../assets/brand-logos/bmw.svg';
import mercedesLogo from '../assets/brand-logos/mercedes.svg';
import hyundaiLogo from '../assets/brand-logos/hyundai.svg';
import kiaLogo from '../assets/brand-logos/kia.svg';
import nissanLogo from '../assets/brand-logos/nissan.svg';
import subaruLogo from '../assets/brand-logos/subaru.svg';
import genericLogo from '../assets/brand-logos/generic-car.svg';

const manufacturerData = {
  toyota: {
    name: 'Toyota',
    logo: toyotaLogo,
    color: '#EB0A1E',
  },
  honda: {
    name: 'Honda',
    logo: hondaLogo,
    color: '#E52521',
  },
  ford: {
    name: 'Ford',
    logo: fordLogo,
    color: '#003478',
  },
  chevrolet: {
    name: 'Chevrolet',
    logo: chevroletLogo,
    color: '#C5A45A',
  },
  bmw: {
    name: 'BMW',
    logo: bmwLogo,
    color: '#0066B4',
  },
  mercedes: {
    name: 'Mercedes-Benz',
    logo: mercedesLogo,
    color: '#A6A6A6',
  },
  hyundai: {
    name: 'Hyundai',
    logo: hyundaiLogo,
    color: '#002C5F',
  },
  kia: {
    name: 'Kia',
    logo: kiaLogo,
    color: '#BB162B',
  },
  nissan: {
    name: 'Nissan',
    logo: nissanLogo,
    color: '#C11030',
  },
  subaru: {
    name: 'Subaru',
    logo: subaruLogo,
    color: '#003893',
  },
  generic: {
    name: 'Vehicle',
    logo: genericLogo,
    color: '#94a3b8', // slate-400
  }
};

export const getManufacturerData = (make) => {
  if (!make) return manufacturerData.generic;
  const normalizedMake = make.toLowerCase().trim();
  
  // Try to find a match
  for (const [key, data] of Object.entries(manufacturerData)) {
    if (normalizedMake.includes(key)) {
      return data;
    }
  }
  
  return manufacturerData.generic;
};

export const getManufacturerLogo = (make) => getManufacturerData(make).logo;
export const getManufacturerColor = (make) => getManufacturerData(make).color;

// A React component for the manufacturer badge
export const ManufacturerBadge = ({ make, size = 24, className = "" }) => {
  const data = getManufacturerData(make);
  
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-md p-1 ${className}`}
      style={{ 
        backgroundColor: `${data.color}20`, // 20 is hex for ~12% opacity
        border: `1px solid ${data.color}40`,
        boxShadow: `0 0 10px ${data.color}20`
      }}
    >
      <img 
        src={data.logo} 
        alt={data.name} 
        style={{ width: size, height: size }}
        className="object-contain"
      />
    </div>
  );
};
