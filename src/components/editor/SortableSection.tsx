import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit3, Check } from 'lucide-react';
import { CVSection, CVTheme } from '../../types/cv';
import { useState, useEffect } from 'react';

interface Props {
  key?: string;
  section: CVSection;
  theme?: CVTheme;
  onUpdate?: (id: string, updatedContent: any) => void;
  onDelete?: (id: string) => void;
}

export const SortableSection = ({ section, theme, onUpdate }: Props) => {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [content, setContent] = useState(section.content || {});

  useEffect(() => {
    setContent(section.content || {});
  }, [section.content]);

  const primaryColor = theme?.primaryColor || '#ff2d8d';
  const fontFamilyClass =
    theme?.fontFamily === 'serif'
      ? 'font-serif'
      : theme?.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const spacingClass =
    theme?.spacingDensity === 'compact'
      ? 'space-y-2 text-xs'
      : theme?.spacingDensity === 'spacious'
      ? 'space-y-5 text-sm'
      : 'space-y-3.5 text-xs';

  const templateId = theme?.templateId || 'moderne';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChange = (key: string, value: any) => {
    const updated = { ...content, [key]: value };
    setContent(updated);
    onUpdate?.(section.id, updated);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...(content.items || [])];
    items[index] = { ...items[index], [field]: value };
    const updated = { ...content, items };
    setContent(updated);
    onUpdate?.(section.id, updated);
  };

  const renderSectionContent = () => {
    const editForm = (
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-4 text-xs font-sans">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
            <span className="font-bold text-zinc-800 uppercase tracking-wider">Édition rapide: {section.type}</span>
            <button
              onClick={() => setIsEditingInline(false)}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Terminé
            </button>
          </div>

          {section.type === 'header' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Photo Upload Area */}
              <div className="sm:col-span-2 p-3 bg-zinc-100 rounded-xl border border-zinc-200/80 space-y-2 mb-1">
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">Photo de Profil</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 border-2 border-white shadow-md shrink-0">
                    {content.photo ? (
                      <img src={content.photo} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px] font-semibold">Aucune</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 text-left">
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                        <span>Sélectionner une image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                handleChange('photo', ev.target?.result as string);
                                handleChange('showPhoto', true);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {content.photo && (
                        <button
                          type="button"
                          onClick={() => {
                            handleChange('photo', '');
                          }}
                          className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-zinc-600 font-semibold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={content.showPhoto !== false}
                        onChange={(e) => handleChange('showPhoto', e.target.checked)}
                        className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Afficher la photo sur le CV</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nom complet</label>
                <input
                  type="text"
                  value={content.fullName || ''}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 font-semibold text-xs focus:ring-2 focus:ring-[#ff2d8d] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Titre / Poste</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 font-semibold text-xs focus:ring-2 focus:ring-[#ff2d8d] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Email</label>
                <input
                  type="text"
                  value={content.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs focus:ring-2 focus:ring-[#ff2d8d] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Téléphone</label>
                <input
                  type="text"
                  value={content.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs focus:ring-2 focus:ring-[#ff2d8d] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Localisation</label>
                <input
                  type="text"
                  value={content.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs focus:ring-2 focus:ring-[#ff2d8d] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Site Web / Portfolio</label>
                <input
                  type="text"
                  value={content.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs focus:ring-2 focus:ring-[#ff2d8d] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Résumé / Bio</label>
                <textarea
                  rows={2}
                  value={content.summary || ''}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs focus:ring-2 focus:ring-[#ff2d8d] focus:outline-none"
                />
              </div>
            </div>
          )}

          {section.type === 'experience' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Titre de section</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 font-semibold text-xs"
                />
              </div>
              {(content.items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-zinc-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Poste"
                      value={item.role || ''}
                      onChange={(e) => handleItemChange(idx, 'role', e.target.value)}
                      className="px-2 py-1 rounded border border-zinc-300 text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Entreprise"
                      value={item.company || ''}
                      onChange={(e) => handleItemChange(idx, 'company', e.target.value)}
                      className="px-2 py-1 rounded border border-zinc-300 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Période (ex: 2022 - Présent)"
                      value={item.period || ''}
                      onChange={(e) => handleItemChange(idx, 'period', e.target.value)}
                      className="px-2 py-1 rounded border border-zinc-300 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Lieu"
                      value={item.location || ''}
                      onChange={(e) => handleItemChange(idx, 'location', e.target.value)}
                      className="px-2 py-1 rounded border border-zinc-300 text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Description des missions..."
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-zinc-300 text-xs"
                  />
                </div>
              ))}
            </div>
          )}

          {section.type === 'skills' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Compétences (séparées par des virgules)</label>
                <input
                  type="text"
                  value={(content.skillsList || []).join(', ')}
                  onChange={(e) => handleChange('skillsList', e.target.value.split(',').map((s: string) => s.trim()))}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {section.type === 'education' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Titre de section</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 font-semibold text-xs"
                />
              </div>
              {(content.items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-zinc-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Diplôme / Formation"
                      value={item.degree || ''}
                      onChange={(e) => handleItemChange(idx, 'degree', e.target.value)}
                      className="px-2 py-1 rounded border border-zinc-300 text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="École / Université"
                      value={item.school || ''}
                      onChange={(e) => handleItemChange(idx, 'school', e.target.value)}
                      className="px-2 py-1 rounded border border-zinc-300 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Période"
                      value={item.period || ''}
                      onChange={(e) => handleItemChange(idx, 'period', e.target.value)}
                      className="px-2 py-1 rounded border border-zinc-300 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Lieu"
                      value={item.location || ''}
                      onChange={(e) => handleItemChange(idx, 'location', e.target.value)}
                      className="px-2 py-1 rounded border border-zinc-300 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    );

    const previewContent = (() => {
      switch (section.type) {
      case 'header':
        if (templateId === 'classique' || templateId === 'legal' || templateId === 'academic') {
          return (
            <div className={`text-center space-y-3 ${fontFamilyClass}`}>
              {content.showPhoto !== false && content.photo && (
                <div className="flex justify-center mb-1">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-200 shadow-sm shrink-0">
                    <img referrerPolicy="no-referrer" src={content.photo} alt="Profil" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div className="border-b-2 border-zinc-900 pb-4">
                <h1 className="text-3xl font-extrabold text-[#0a0a0a] tracking-tight uppercase">{content.fullName || 'Votre Nom'}</h1>
                <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: primaryColor }}>{content.title || 'Intitulé de poste'}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-600 font-medium">
                {content.email && <span>📧 {content.email}</span>}
                {content.phone && <span>📞 {content.phone}</span>}
                {content.location && <span>📍 {content.location}</span>}
                {content.website && <span>🌐 {content.website}</span>}
              </div>
              {content.summary && (
                <p className="text-xs text-zinc-700 leading-relaxed max-w-xl mx-auto italic">
                  "{content.summary}"
                </p>
              )}
            </div>
          );
        }

        if (templateId === 'creatif' || templateId === 'vibrant' || templateId === 'startup') {
          return (
            <div className={`space-y-4 ${fontFamilyClass}`}>
              <div className="p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row gap-5 items-center justify-between" style={{ backgroundColor: primaryColor }}>
                <div className="space-y-2 flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-black tracking-tight">{content.fullName || 'Votre Nom'}</h1>
                  <p className="text-sm font-semibold opacity-90 mt-1">{content.title || 'Intitulé de poste'}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs opacity-90 mt-4 font-medium">
                    {content.email && <span>📧 {content.email}</span>}
                    {content.phone && <span>📞 {content.phone}</span>}
                    {content.location && <span>📍 {content.location}</span>}
                    {content.website && <span>🌐 {content.website}</span>}
                  </div>
                </div>
                {content.showPhoto !== false && content.photo && (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg shrink-0">
                    <img referrerPolicy="no-referrer" src={content.photo} alt="Profil" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {content.summary && (
                <p className="text-xs text-zinc-600 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: primaryColor }}>
                  "{content.summary}"
                </p>
              )}
            </div>
          );
        }

        if (templateId === 'pro' || templateId === 'bold_header' || templateId === 'split_left') {
          return (
            <div className={`space-y-3 ${fontFamilyClass}`}>
              <div className="bg-zinc-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4" style={{ borderColor: primaryColor }}>
                <div className="space-y-1 flex-1 text-left">
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">{content.fullName || 'Votre Nom'}</h1>
                  <p className="text-sm font-bold uppercase tracking-wider mt-1" style={{ color: primaryColor }}>{content.title || 'Intitulé de poste'}</p>
                </div>
                {content.showPhoto !== false && content.photo && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-zinc-800 shadow-sm shrink-0">
                    <img referrerPolicy="no-referrer" src={content.photo} alt="Profil" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-right text-xs text-zinc-300 space-y-1 shrink-0">
                  {content.email && <div>{content.email}</div>}
                  {content.phone && <div>{content.phone}</div>}
                  {content.location && <div>{content.location}</div>}
                </div>
              </div>
              {content.summary && (
                <p className="text-xs text-zinc-600 leading-relaxed pt-2">
                  {content.summary}
                </p>
              )}
            </div>
          );
        }

        if (templateId === 'luxure' || templateId === 'elegant_serif') {
          return (
            <div className={`text-center space-y-3 font-serif`}>
              {content.showPhoto !== false && content.photo && (
                <div className="flex justify-center mb-1">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-amber-900/10 shadow-sm shrink-0">
                    <img referrerPolicy="no-referrer" src={content.photo} alt="Profil" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div className="border-b border-amber-900/20 pb-4">
                <h1 className="text-3xl font-normal tracking-widest text-[#0a0a0a] uppercase">{content.fullName || 'Votre Nom'}</h1>
                <p className="text-xs font-semibold uppercase tracking-widest mt-2 text-amber-800" style={{ color: primaryColor }}>{content.title || 'Intitulé de poste'}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-zinc-600 font-light italic">
                {content.email && <span>{content.email}</span>}
                {content.phone && <span>{content.phone}</span>}
                {content.location && <span>{content.location}</span>}
              </div>
              {content.summary && (
                <p className="text-xs text-zinc-600 leading-relaxed max-w-lg mx-auto font-light pt-1">
                  {content.summary}
                </p>
              )}
            </div>
          );
        }

        // Moderne / Minimal / Tech Lead / Nordic Default
        return (
          <div className={`space-y-3 ${fontFamilyClass}`}>
            <div className="border-b border-zinc-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-[#0a0a0a] tracking-tight">{content.fullName || 'Votre Nom'}</h1>
                <p className="text-sm font-semibold mt-1" style={{ color: primaryColor }}>{content.title || 'Intitulé de poste'}</p>
              </div>
              {content.showPhoto !== false && content.photo && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0">
                  <img referrerPolicy="no-referrer" src={content.photo} alt="Profil" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
              {content.email && <span>📧 {content.email}</span>}
              {content.phone && <span>📞 {content.phone}</span>}
              {content.location && <span>📍 {content.location}</span>}
              {content.website && <span>🌐 {content.website}</span>}
            </div>
            {content.summary && (
              <p className="text-xs text-zinc-600 leading-relaxed pt-2 italic text-left">
                "{content.summary}"
              </p>
            )}
          </div>
        );

      case 'experience':
        return (
          <div className={`space-y-4 ${fontFamilyClass}`}>
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 border-b"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              {content.title || 'Expérience Professionnelle'}
            </h2>
            <div className={spacingClass}>
              {(content.items || []).map((item: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-[#0a0a0a]">{item.role}</h3>
                    <span className="text-[11px] font-semibold text-zinc-400">{item.period}</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-600">{item.company} • {item.location}</p>
                  <p className="text-xs text-zinc-600 leading-relaxed pt-0.5">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className={`space-y-3 ${fontFamilyClass}`}>
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 border-b"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              {content.title || 'Formation'}
            </h2>
            <div className={spacingClass}>
              {(content.items || []).map((item: any, idx: number) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-[#0a0a0a]">{item.degree}</h3>
                    <span className="text-[11px] font-semibold text-zinc-400">{item.period}</span>
                  </div>
                  <p className="text-xs text-zinc-600">{item.school} • {item.location}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className={`space-y-3 ${fontFamilyClass}`}>
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 border-b"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              {content.title || 'Compétences'}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {(content.skillsList || []).map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor,
                    borderColor: `${primaryColor}30`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className={fontFamilyClass}>
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 border-b"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              {section.type}
            </h2>
          </div>
        );
    }
    })();

    return (
      <>
        <div className={`section-edit-form ${isEditingInline ? 'block' : 'hidden'} no-print`}>
          {editForm}
        </div>
        <div className={`section-preview-content ${isEditingInline ? 'hidden' : 'block'}`}>
          {previewContent}
        </div>
      </>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-xl p-4 transition-all border ${
        isDragging
          ? 'shadow-xl opacity-80 z-50'
          : 'border-transparent hover:border-zinc-200 hover:shadow-sm'
      }`}
    >
      {/* Drag & Controls Overlay */}
      <div className="no-print absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-zinc-200 shadow-sm z-10">
        <button
          onClick={() => setIsEditingInline(!isEditingInline)}
          className="p-1 hover:bg-zinc-100 rounded text-zinc-600 hover:text-zinc-900 transition-colors"
          title="Modifier le contenu"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-700"
          title="Faire glisser pour réordonner"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Rendered Content */}
      <div className="pt-1">
        {renderSectionContent()}
      </div>
    </div>
  );
};


