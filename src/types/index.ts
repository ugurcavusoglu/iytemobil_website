export interface Feature {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  color: string;
  gradient: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
}

export interface Screenshot {
  id: string;
  src: string;
  altKey: string;
}

export interface NavLink {
  href: string;
  labelKey: string;
}

export interface Stat {
  value: number;
  suffix: string;
  labelKey: string;
}
