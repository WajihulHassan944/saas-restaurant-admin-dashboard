'use client';

import { X } from 'lucide-react';

const OrderDetailsMain = () => {
  const items = [
    { name: 'Watermelon juice with ice', qty: 1, price: 4.12 },
    { name: 'Italiano pizza with garlic', qty: 1, price: 15.44 },
    { name: 'Chicken curry special with cucumber', qty: 3, price: 14.99 },
  ];

  return (
    <div className="w-full mt-5 ">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-9">
        {/* ITEMS CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_100px_120px_40px] text-sm font-semibold text-gray-600 pb-4 border-b">
            <span>Items</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total Price</span>
            <span />
          </div>

          {/* Items */}
          <div className="divide-y">
            {items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_80px_100px_120px_40px] items-center py-5"
              >
                {/* Item Info */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-lg bg-gray-200" />
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase">
                      Main Course
                    </p>
                    <p className="font-medium text-gray-900">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-orange-400 mt-1">
                      ★★★★☆
                      <span className="text-gray-400 text-xs ml-1">
                        (454 reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Qty */}
                <span className="text-center text-gray-700">
                  {item.qty}x
                </span>

                {/* Price */}
                <span className="text-right text-gray-700">
                  ${item.price.toFixed(2)}
                </span>

                {/* Total */}
                <span className="text-right font-semibold text-gray-900">
                  ${(item.qty * item.price).toFixed(2)}
                </span>

                {/* Remove */}
                <div className="flex justify-end">
                  <X className="w-5 h-5 text-red-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HISTORY CARD */}
       {/* HISTORY CARD */}
<div className="bg-white rounded-2xl p-6 shadow-sm">
  <h3 className="text-lg font-semibold mb-6">History</h3>

  <div className="space-y-0">
    {[
      { label: 'Order Delivered', date: '-', active: false },
      { label: 'On Delivery', date: 'Sat, 23 Jul 2020, 01:24 PM', active: true },
      { label: 'Payment Success', date: 'Fri, 22 Jul 2020, 10:44 AM', active: true },
      { label: 'Order Created', date: 'Thu, 21 Jul 2020, 11:49 AM', active: true },
    ].map((h, i, arr) => {
      const nextIsActive = arr[i + 1]?.active;

      return (
        <div key={i} className="relative flex gap-4">
          {/* Timeline column */}
          <div className="flex flex-col items-center">
            {/* Dot */}
            <span
              className={`w-3 h-3 rounded-full ${
                h.active ? 'bg-red-500' : 'bg-gray-300'
              }`}
            />

            {/* Line BELOW dot */}
            {i !== arr.length - 1 && (
              <span
                className={`w-px flex-1 ${
                  h.active && nextIsActive
                    ? 'bg-red-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>

          {/* Content — aligned to dot */}
          <div className="pt-[2px] pb-6">
            <p className="font-medium text-gray-900 leading-tight">
              {h.label}
            </p>
            <p className="text-sm text-gray-500 leading-tight">
              {h.date}
            </p>
          </div>
        </div>
      );
    })}
  </div>
</div>

      </div>
    </div>
  );
};

export default OrderDetailsMain;
