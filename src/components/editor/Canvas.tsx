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
        <div
          id="cv-canvas"
          className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-zinc-200/80 rounded-sm min-h-[297mm] w-full max-w-[210mm] mx-auto p-12 md:p-16 transition-all space-y-6 text-[#0a0a0a]"
        >
          {data.sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              theme={data.theme}
              onUpdate={handleUpdateSection}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

