import React, { createContext } from "react"

export const MouseContext: React.Context<[number, number]> = createContext<[number, number]>([0, 0]);