import type { Patient, Vaccine } from "./types"
import { Card } from "./components/card"

const mockPatient: Patient = {
  name: "Sofía Ramírez Torres",
  gender: "F",
  birthday: "2018-04-12",
  parent: {
    name: "Carlos Ramírez López",
    relationship: "Padre",
    phone: "+52 55 1234 5678",
  },
}

const mockVaccines: Vaccine[] = [
  {
    name: "BCG",
    doses: ["2018-04-12"],
  },
  {
    name: "Hepatitis B",
    doses: ["2018-04-12", "2018-05-12", "2018-10-12"],
  },
  {
    name: "Polio (IPV)",
    doses: ["2018-06-12", "2018-08-12", "2020-06-12"],
  },
  {
    name: "Triple viral (SRP)",
    doses: ["2019-04-12", "2025-04-12"],
  },
  {
    name: "Influenza",
    doses: ["2024-10-01", "2025-10-01"],
  },
]

function App() {
  return (
    <>
      <div className='h-screen w-screen flex flex-col items-center justify-center'>
        <Card patient={mockPatient} vaccines={mockVaccines} />
      </div>
    </>
  )
}

export default App
