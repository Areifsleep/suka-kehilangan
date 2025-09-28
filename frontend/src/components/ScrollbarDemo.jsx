import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Demo component untuk menunjukkan bagaimana scrollbar space allocation
 * mencegah layout shift saat content berubah panjang
 */
export const ScrollbarDemo = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const addItems = () => {
    const currentLength = items.length;
    const newItems = Array.from({ length: 10 }, (_, i) => currentLength + i + 1);
    setItems((prev) => [...prev, ...newItems]);
  };

  const clearItems = () => {
    setItems([1, 2, 3]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={addItems}
              variant="outline"
            >
              Tambah Item (Munculkan Scrollbar)
            </Button>
            <Button
              onClick={clearItems}
              variant="outline"
            >
              Reset (Hilangkan Scrollbar)
            </Button>
          </div>

          <div className="text-sm text-gray-600">Perhatikan bahwa layout tidak bergeser saat scrollbar muncul/hilang</div>

          {/* Container dengan scrollbar space allocation */}
          <div className="h-64 border rounded-md scrollbar-gutter-stable overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-2">
              {items.map((item) => (
                <div
                  key={item}
                  className="p-3 bg-gray-100 rounded border text-center"
                >
                  Item {item}
                </div>
              ))}
            </div>
          </div>

          {/* Container tanpa scrollbar space allocation (untuk perbandingan) */}
          <div className="text-sm font-medium">Tanpa scrollbar allocation (akan bergeser):</div>
          <div className="h-32 border rounded-md overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-2">
              {items.slice(0, 5).map((item) => (
                <div
                  key={item}
                  className="p-2 bg-red-100 rounded border text-center text-sm"
                >
                  Item {item} (akan bergeser)
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
