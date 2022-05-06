export interface User {
  id: number,
  username: string,
  password: string,
  first_names: string,
  last_namees: string,
  security_lvl: string,
  date_added: string
};

export interface CurrOrderStatus {
  id_etapa: number
}

export interface Order {
  id: number,
  vueltas: number,
  cliente: number,
  id_etapa: number,
  prod_time: string,
  name: string,
};

export interface NamedOrder {
  id: number,
  vueltas: number,
  etapa: string,
  prod_time: string
}

export interface percentages {
  total_orders: number,
  not_approved: number,
  approved: number,
  in_prod: number,
  finished: number,
}