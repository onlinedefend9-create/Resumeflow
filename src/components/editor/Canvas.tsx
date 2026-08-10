import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';
import { useCVData } from '../../hooks/useCVData';

export const Canvas = () => {
  const { data, setData } = useCVData();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
        const newIndex = prev.sections.findIndex((s) => s.id === over.id);

        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex),
        };
      });
    }
  };

  const handleUpdateSection = (id: string, updatedContent: any) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, content: updatedContent } : s)),
    }));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={data.sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="relative group/canvas w-full max-w-[210mm] mx-auto print:p-0">
          {/* Subtle A4 format watermark indicator for creators */}
          <div className="no-print flex items-center justify-between px-3 py-1.5 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border border-zinc-200/50 bg-zinc-50/50 rounded-lg select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Aperçu d'impression dynamique (A4)
            </span>
            <span>210 x 297 mm • 100% vectoriel</span>
          </div>

          <div
            id="cv-canvas"
            className="relative bg-white shadow-[0_24px_70px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_80px_rgba(0,0,0,0.1)] border border-zinc-200/90 rounded-xs min-h-[297mm] w-full p-6 sm:p-10 md:p-14 lg:p-16 transition-all duration-300 space-y-6 sm:space-y-8 text-[#0a0a0a]"
          >
            {/* Subtle premium corners layout for designer feel */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-200 rounded-tl-sm pointer-events-none no-print"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-200 rounded-tr-sm pointer-events-none no-print"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-200 rounded-bl-sm pointer-events-none no-print"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-200 rounded-br-sm pointer-events-none no-print"></div>

            {data.sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                theme={data.theme}
                onUpdate={handleUpdateSection}
              />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

