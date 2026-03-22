import { useState } from "react"

const productos = [
  { id: 1, nombre: "Cemento Portland 42.5kg", precio: 28.50, categoria: "construccion" },
  { id: 2, nombre: "Varilla de acero 1/2\"", precio: 15.00, categoria: "construccion" },
  { id: 3, nombre: "Ladrillo King Kong x millar", precio: 450.00, categoria: "construccion" },
  { id: 4, nombre: "Pintura látex 4L", precio: 42.00, categoria: "acabados" },
  { id: 5, nombre: "Cerámico 45x45cm x caja", precio: 65.00, categoria: "acabados" },
  { id: 6, nombre: "Tubería PVC 4\" x 3m", precio: 18.00, categoria: "instalaciones" },
]

export default function App() {
  const [carrito, setCarrito] = useState([])
  const [vista, setVista] = useState("tienda")
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", empresa: "", tipo: "personal", direccion: "" })
  const [enviado, setEnviado] = useState(false)

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) return prev.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p)
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const cambiarCantidad = (id, delta) => {
    setCarrito(prev => prev
      .map(p => p.id === id ? { ...p, cantidad: p.cantidad + delta } : p)
      .filter(p => p.cantidad > 0)
    )
  }

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  const enviarPedido = async () => {
    const pedido = { ...form, carrito, total, fecha: new Date().toISOString() }
    const response = await fetch(import.meta.env.VITE_API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(pedido)
})
const data = await response.json()
if (!data.ok) throw new Error(data.error)
    setEnviado(true)
  }

  if (enviado) return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">¡Pedido enviado!</h2>
        <p className="text-gray-500">Nos contactaremos contigo pronto.</p>
        <button onClick={() => { setEnviado(false); setVista("tienda"); setCarrito([]) }}
          className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
          Hacer otro pedido
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">🏗️ Materiales Pro</h1>
        <button onClick={() => setVista(vista === "tienda" ? "carrito" : "tienda")}
          className="bg-white text-blue-700 px-4 py-1 rounded-full font-semibold text-sm">
          🛒 Carrito ({carrito.reduce((a, p) => a + p.cantidad, 0)})
        </button>
      </header>

      {vista === "tienda" && (
        <main className="max-w-5xl mx-auto p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Nuestros productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {productos.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <span className="text-xs text-blue-500 uppercase font-semibold">{p.categoria}</span>
                <h3 className="font-semibold text-gray-800">{p.nombre}</h3>
                <p className="text-blue-700 font-bold text-lg">S/ {p.precio.toFixed(2)}</p>
                <button onClick={() => agregarAlCarrito(p)}
                  className="mt-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {vista === "carrito" && (
        <main className="max-w-2xl mx-auto p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Tu carrito</h2>
          {carrito.length === 0 ? (
            <p className="text-gray-400 text-center py-12">El carrito está vacío</p>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow divide-y mb-4">
                {carrito.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{p.nombre}</p>
                      <p className="text-blue-600 text-sm">S/ {p.precio.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => cambiarCantidad(p.id, -1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                      <span className="w-6 text-center font-semibold">{p.cantidad}</span>
                      <button onClick={() => cambiarCantidad(p.id, 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow p-4 mb-4">
                <p className="text-right font-bold text-lg text-gray-800">Total: S/ {total.toFixed(2)}</p>
              </div>

              {/* Formulario del cliente */}
              <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
                <h3 className="font-semibold text-gray-700">Datos del cliente</h3>
                <input placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                <input placeholder="Dirección de entrega" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600 font-medium">Tipo de pedido</label>
                  <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <option value="personal">Personal / uso propio (B2C)</option>
                    <option value="empresarial">Empresarial / mayorista (B2B)</option>
                  </select>
                </div>
                {form.tipo === "empresarial" && (
                  <input placeholder="Nombre de la empresa" value={form.empresa} onChange={e => setForm({...form, empresa: e.target.value})}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                )}
                <button onClick={enviarPedido}
                  disabled={!form.nombre || !form.email || !form.telefono}
                  className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
                  Confirmar pedido
                </button>
              </div>
            </>
          )}
        </main>
      )}
    </div>
  )
}