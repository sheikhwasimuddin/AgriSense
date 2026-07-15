import { useQuery } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { Card } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

export default function FarmMap() {
  const { data: farms, isLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: farmsService.getFarms,
  });

  const center: [number, number] = farms && farms.length > 0
    ? [farms[0].latitude, farms[0].longitude]
    : [20.5937, 78.9629]; // Default to India center

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Map className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Farm Map
          </h1>
          <p className="text-muted-foreground mt-0.5">
            {farms ? `${farms.length} farm(s) on the map` : "Interactive satellite view of all your farms"}
          </p>
        </div>
      </div>

      <Card className="glass border-black/10 dark:border-white/10 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-[1000]" />
        <div className="h-[600px] w-full rounded-b-xl overflow-hidden">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={farms && farms.length === 1 ? 12 : 5}
              className="h-full w-full z-0"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {farms?.map((farm) => (
                <Marker key={farm.id} position={[farm.latitude, farm.longitude]}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-base flex items-center gap-1">
                        <span>🌾</span> {farm.farm_name}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="flex items-center gap-1"><span>📍</span> {farm.location}</p>
                        <p className="flex items-center gap-1"><span>🌿</span> Crop: {farm.crop}</p>
                        <p className="flex items-center gap-1"><span>📐</span> Area: {farm.area} ha</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
