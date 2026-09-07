"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Flame, ChevronRight } from "lucide-react";
import { INSPIRATION_ITEMS, InspirationItem } from "./types";

interface ImageInspirationGalleryProps {
  onApplyInspiration: (item: InspirationItem) => void;
  items?: InspirationItem[];
}

const TAG_CATEGORIES = ["Em Alta", "Personagens", "Cenários", "Produtos", "Anime", "Arte", "Minimalista"];

export function ImageInspirationGallery({
  onApplyInspiration,
  items = INSPIRATION_ITEMS,
}: ImageInspirationGalleryProps) {
  const [selectedTag, setSelectedTag] = useState<string>("Em Alta");

  const filteredInspirations =
    selectedTag === "Em Alta"
      ? items
      : items.filter((i) => i.tag.toLowerCase() === selectedTag.toLowerCase());

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E202E] pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-heading">
            Exemplos e Inspirações
          </h2>
        </div>

        {/* Abas / Filtros de Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {TAG_CATEGORIES.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                    : "bg-[#070709] border border-[#1E202E] text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <Link
          href="/dashboard/library"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          <span>Ver mais</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid de Cards de Inspiração */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {filteredInspirations.map((item) => (
          <div
            key={item.id}
            onClick={() => onApplyInspiration(item)}
            className="group relative rounded-xl overflow-hidden border border-[#1E202E] hover:border-cyan-400 aspect-[4/5] bg-black/60 cursor-pointer transition-all shadow-md hover:shadow-cyan-400/20"
          >
            <img
              src={item.thumb}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-2.5">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/30 text-violet-300 border border-violet-500/30 w-fit mb-1">
                {item.tag}
              </span>
              <h3 className="text-xs font-bold text-white truncate leading-tight">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
