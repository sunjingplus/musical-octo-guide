"use client"
import React, { useState } from "react";
import config from "../../../../config";
import ButtonCheckout from "./ButtonCheckout";

const Pricing = () => {
  // 状态：控制显示月度价格还是年度价格
  const [isAnnual, setIsAnnual] = useState(false);

  // 切换价格类型
  const togglePriceType = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <section className="bg-gray-900 overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-pink-500 mb-8">Pricing</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight text-white">
            AI Music Generator
          </h2>
        </div>

        {/* 切换按钮 */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex items-center justify-center rounded-md overflow-hidden text-white">
            <button
              onClick={togglePriceType}
              className={`w-1/2 py-2 text-sm font-medium text-center p-4 text-white ${
                isAnnual
                  ? "bg-pink-500 "
                  : "bg-gray-700 text-gray-600 hover:bg-pink-500 "
              }`}
            >
              Annual
            </button>
            <button
              onClick={togglePriceType}
              className={`w-1/2 py-2 text-sm font-medium text-center p-4 text-white ${
                !isAnnual
                  ? "bg-pink-500 "
                  : "bg-gray-700 text-gray-600 hover:bg-pink-500"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {config.stripe.plans.map((plan) => (
            <div
              key={plan.priceId}
              className="relative w-full max-w-lg lg:w-1/4"
            >
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span
                    className={`badge text-xs text-white font-semibold border-0 bg-pink-700`}
                  >
                    POPULAR
                  </span>
                </div>
              )}

              {plan.isFeatured && (
                <div
                  className={`absolute -inset-[1px] rounded-[9px] border border-gray-300 bg-transparent z-10`}
                ></div>
              )}

              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-transparent p-8 rounded-lg border border-gray-300">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="text-lg lg:text-xl font-bold">{plan.name}</p>
                    {plan.description && (
                      <p className="text-gray-600 mt-2">{plan.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {plan.priceAnchor && (
                    <div className="flex flex-col justify-end mb-[4px] text-lg">
                      <p className="relative">
                        <span className="absolute bg-gray-600 h-[1.5px] inset-x-0 top-[53%]"></span>
                        <span className="text-gray-600">
                          ${plan.priceAnchor}
                        </span>
                      </p>
                    </div>
                  )}
                  <p
                    className={`text-5xl tracking-tight font-extrabold text-pink-700`}
                  >
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      USD
                    </p>
                  </div>
                </div>
                {plan.features && (
                  <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-[18px] h-[18px] opacity-80 shrink-0 text-pink-700"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="space-y-2">
                  <ButtonCheckout priceId={plan.priceId} />

                  <p className="flex items-center justify-center gap-2 text-sm text-center text-gray-600 font-medium relative">
                    Pay once. Access forever.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
