/**
 * The property photo library.
 *
 * Statically imported so Next.js optimises them at BUILD time (responsive
 * AVIF/WebP srcsets, no on-demand transform, no cold-cache delay on first
 * visit). Sections reference photos by these slugs; a single path change here
 * updates the whole site.
 */
import approach from "@/public/Twin-Tower/approach.webp";
import balcony from "@/public/Twin-Tower/balcony.webp";
import balconyBreakfast from "@/public/Twin-Tower/poster-4.webp";
import bathroom from "@/public/Twin-Tower/bathroom.webp";
import bathroom2 from "@/public/Twin-Tower/bathroom-2.webp";
import corridor from "@/public/Twin-Tower/corridor.webp";
import entrance from "@/public/Twin-Tower/entrance.webp";
import exterior from "@/public/Twin-Tower/exterior.webp";
import facade from "@/public/Twin-Tower/facade.webp";
import lawn from "@/public/Twin-Tower/lawn.webp";
import lawnNight from "@/public/Twin-Tower/poster-3.webp";
import lobby from "@/public/Twin-Tower/lobby.webp";
import lounge from "@/public/Twin-Tower/lounge.webp";
import poster1 from "@/public/Twin-Tower/poster-1.webp";
import poster2 from "@/public/Twin-Tower/poster-2.webp";
import reception from "@/public/Twin-Tower/reception.webp";
import restaurant from "@/public/Twin-Tower/restaurant.webp";
import restaurant2 from "@/public/Twin-Tower/restaurant-2.webp";
import roomDetail from "@/public/Twin-Tower/room-detail.webp";
import suiteAttic1 from "@/public/Twin-Tower/suite-attic-1.webp";
import suiteAttic2 from "@/public/Twin-Tower/suite-attic-2.webp";
import suiteAttic3 from "@/public/Twin-Tower/suite-attic-3.webp";
import suiteKing1 from "@/public/Twin-Tower/suite-king-1.webp";
import suiteKing2 from "@/public/Twin-Tower/suite-king-2.webp";
import suiteKing3 from "@/public/Twin-Tower/suite-king-3.webp";
import suiteKing4 from "@/public/Twin-Tower/suite-king-4.webp";
import suiteKing5 from "@/public/Twin-Tower/suite-king-5.webp";
import suiteKing6 from "@/public/Twin-Tower/suite-king-6.webp";
import suiteKing7 from "@/public/Twin-Tower/suite-king-7.webp";

const FILES = {
  exterior,
  facade,
  entrance,
  approach,
  lawn,
  "lawn-night": lawnNight,
  lounge,
  lobby,
  reception,
  corridor,
  elevator: corridor,
  balcony,
  "balcony-breakfast": balconyBreakfast,
  restaurant,
  "restaurant-2": restaurant2,
  bathroom,
  "bathroom-2": bathroom2,
  "room-detail": roomDetail,
  "poster-1": poster1,
  "poster-2": poster2,
  "poster-3": lawnNight,
  "poster-4": balconyBreakfast,
  "suite-king-1": suiteKing1,
  "suite-king-2": suiteKing2,
  "suite-king-3": suiteKing3,
  "suite-king-4": suiteKing4,
  "suite-king-5": suiteKing5,
  "suite-king-6": suiteKing6,
  "suite-king-7": suiteKing7,
  "suite-attic-1": suiteAttic1,
  "suite-attic-2": suiteAttic2,
  "suite-attic-3": suiteAttic3,
};

export function photo(name: keyof typeof FILES) {
  return FILES[name];
}

export default photo;
