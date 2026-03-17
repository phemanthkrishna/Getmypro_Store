export interface Material {
  name: string;
  qty: number;
  unit: string;
}

export interface Order {
  id: string;
  workerName: string;
  workerPhone: string;
  jobType: string;
  jobAddress: string;
  compOtp: string;
  materials: Material[];
}

export const DEMO_ORDERS: Order[] = [
  {
    id: 'MAT-2041',
    workerName: 'Ravi Kumar',
    workerPhone: '9876543210',
    jobType: 'Electrician',
    jobAddress: 'Flat 7, Near Bus Stand, Bobbili',
    compOtp: '4521',
    materials: [
      { name: 'Wire 2.5mm', qty: 10, unit: 'metres' },
      { name: 'Switchboard', qty: 2, unit: 'nos' },
      { name: 'MCB 32A', qty: 1, unit: 'nos' },
    ],
  },
  {
    id: 'MAT-2042',
    workerName: 'Suresh Babu',
    workerPhone: '9876543211',
    jobType: 'Plumbing',
    jobAddress: 'House 5, Gandhi Nagar, Bobbili',
    compOtp: '7832',
    materials: [
      { name: 'PVC Pipe 1 inch', qty: 6, unit: 'metres' },
      { name: 'Elbow joint', qty: 4, unit: 'nos' },
      { name: 'Teflon tape', qty: 2, unit: 'rolls' },
    ],
  },
];

// Pool of random workers / jobs / materials for demo
const RANDOM_WORKERS = [
  { name: 'Krishnam Raju', phone: '9912345678' },
  { name: 'Venkat Babu', phone: '9823456789' },
  { name: 'Srinivas Reddy', phone: '9734567890' },
  { name: 'Murali Krishna', phone: '9645678901' },
  { name: 'Ramesh Naidu', phone: '9556789012' },
  { name: 'Anand Kumar', phone: '9467890123' },
];

const RANDOM_JOBS = [
  { type: 'Painting', address: 'Plot 12, Nehru Colony, Bobbili' },
  { type: 'Carpentry', address: 'Door 3, Near Temple, Bobbili' },
  { type: 'Tiling', address: 'House 19, Rajiv Nagar, Bobbili' },
  { type: 'Welding', address: 'Shop 6, Market Street, Bobbili' },
  { type: 'Mason work', address: 'Flat 4, New Colony, Bobbili' },
  { type: 'Electrician', address: 'Plot 8, Bank Road, Bobbili' },
];

const RANDOM_MATERIAL_SETS: Material[][] = [
  [
    { name: 'Wall Putty', qty: 5, unit: 'kg' },
    { name: 'Emulsion Paint', qty: 2, unit: 'litres' },
    { name: 'Paint Brush 4 inch', qty: 3, unit: 'nos' },
  ],
  [
    { name: 'Teak Wood Plank', qty: 4, unit: 'nos' },
    { name: 'Wood Screw 3 inch', qty: 20, unit: 'nos' },
    { name: 'Wood Polish', qty: 1, unit: 'litre' },
  ],
  [
    { name: 'Ceramic Tiles 2x2', qty: 12, unit: 'nos' },
    { name: 'Tile Adhesive', qty: 3, unit: 'kg' },
    { name: 'Tile Spacer', qty: 50, unit: 'nos' },
  ],
  [
    { name: 'MS Rod 10mm', qty: 6, unit: 'metres' },
    { name: 'Welding Rod', qty: 10, unit: 'nos' },
    { name: 'Angle Grinder Disc', qty: 2, unit: 'nos' },
  ],
  [
    { name: 'Cement 53 Grade', qty: 2, unit: 'bags' },
    { name: 'River Sand', qty: 3, unit: 'bags' },
    { name: 'M-seal', qty: 1, unit: 'nos' },
  ],
  [
    { name: 'LED Bulb 9W', qty: 4, unit: 'nos' },
    { name: 'Fan Regulator', qty: 1, unit: 'nos' },
    { name: 'Cable 1.5mm', qty: 15, unit: 'metres' },
  ],
];

export const STORE = {
  name: 'Sri Lakshmi Hardware',
  location: 'Bobbili Main Road, Bobbili',
  owner: 'Venkata Rao',
};

let orderCounter = 2043;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomOrder(): Order {
  const id = `MAT-${orderCounter++}`;
  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const worker = pick(RANDOM_WORKERS);
  const job = pick(RANDOM_JOBS);
  const materials = pick(RANDOM_MATERIAL_SETS);
  return {
    id,
    workerName: worker.name,
    workerPhone: worker.phone,
    jobType: job.type,
    jobAddress: job.address,
    compOtp: otp,
    materials,
  };
}
