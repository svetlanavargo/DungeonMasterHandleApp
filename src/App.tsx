import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.tsx';
import Dice from './components/Dice/Dice.tsx';
import BattleTracker from './components/BattleTracker/BattleTracker.tsx';
import SpellsTracker from './components/Spells Tracker/SpellsTracker.tsx';
import Inventory from './components/Inventory/Inventory.tsx';
import './App.css'

export interface Card {
    id: string,
    name: string,
    maxHits: number,
    currentHits: number,
    ac: number,
    note?: string,
    isPlayer: boolean,
    initiativeBonus: number,
    color?: 'red' | 'blue' | 'green' | undefined
}

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/dice" element={<Dice />} />
                <Route path="/spells_tracker" element={<SpellsTracker />} />
                <Route path="/battle_tracker" element={<BattleTracker />} />
                <Route path="/inventory" element={<Inventory />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;