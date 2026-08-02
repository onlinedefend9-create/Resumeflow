import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useCVData } from '../../hooks/useCVData';
import { useLanguage } from '../../i18n/LanguageContext';
import { ZoomIn, ZoomOut, RotateCcw, Award, Briefcase, GraduationCap, User, FolderGit2, Sparkles, HelpCircle, Eye, Info } from 'lucide-react';

interface TreeNode {
  name: string;
  type?: string;
  details?: any;
  children?: TreeNode[];
}

export const CVRadarDendrogram = () => {
  const { data, editorTheme } = useCVData();
  const { language } = useLanguage();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radarMode, setRadarMode] = useState<'radial' | 'cluster'>('radial');
  const [glowColor, setGlowColor] = useState('#3b82f6'); // Dynamic primary color
  
  const isFr = language === 'fr';

  useEffect(() => {
    if (data?.theme?.primaryColor) {
      setGlowColor(data.theme.primaryColor);
    }
  }, [data?.theme?.primaryColor]);

  // Convert CV data into a beautiful hierarchical tree
  const convertCVToTree = (): TreeNode => {
    const sections = data?.sections || [];
    const headerSection = sections.find((s: any) => s.type === 'header')?.content || {};
    
    const rootName = headerSection.fullName || (isFr ? 'Votre CV' : 'Your Resume');
    const children: TreeNode[] = [];

    // 1. Profil / Header info
    const profileChildren: TreeNode[] = [];
    if (headerSection.title) profileChildren.push({ name: headerSection.title, type: 'title' });
    if (headerSection.email) profileChildren.push({ name: headerSection.email, type: 'email' });
    if (headerSection.phone) profileChildren.push({ name: headerSection.phone, type: 'phone' });
    if (headerSection.location) profileChildren.push({ name: headerSection.location, type: 'location' });
    if (headerSection.website) profileChildren.push({ name: headerSection.website, type: 'website' });
    
    if (profileChildren.length > 0) {
      children.push({
        name: isFr ? 'Profil Personnel' : 'Personal Profile',
        type: 'category-profile',
        children: profileChildren
      });
    }

    // 2. Experience
    const expSection = sections.find((s: any) => s.type === 'experience');
    const expItems = expSection?.content?.items || [];
    if (expItems.length > 0) {
      children.push({
        name: expSection?.content?.title || (isFr ? 'Expériences' : 'Experience'),
        type: 'category-experience',
        children: expItems.map((item: any) => {
          const detailChildren: TreeNode[] = [];
          if (item.role) detailChildren.push({ name: item.role, type: 'detail-role' });
          if (item.period) detailChildren.push({ name: item.period, type: 'detail-period' });
          if (item.location) detailChildren.push({ name: item.location, type: 'detail-location' });
          
          return {
            name: item.company || (isFr ? 'Entreprise' : 'Company'),
            type: 'experience-item',
            details: item,
            children: detailChildren.length > 0 ? detailChildren : undefined
          };
        })
      });
    }

    // 3. Education
    const eduSection = sections.find((s: any) => s.type === 'education');
    const eduItems = eduSection?.content?.items || [];
    if (eduItems.length > 0) {
      children.push({
        name: eduSection?.content?.title || (isFr ? 'Formations' : 'Education'),
        type: 'category-education',
        children: eduItems.map((item: any) => {
          const detailChildren: TreeNode[] = [];
          if (item.degree) detailChildren.push({ name: item.degree, type: 'detail-degree' });
          if (item.period) detailChildren.push({ name: item.period, type: 'detail-period' });
          
          return {
            name: item.school || (isFr ? 'Établissement' : 'School'),
            type: 'education-item',
            details: item,
            children: detailChildren.length > 0 ? detailChildren : undefined
          };
        })
      });
    }

    // 4. Skills
    const skillsSection = sections.find((s: any) => s.type === 'skills');
    const skillsList = skillsSection?.content?.skillsList || [];
    if (skillsList.length > 0) {
      children.push({
        name: skillsSection?.content?.title || (isFr ? 'Compétences' : 'Skills'),
        type: 'category-skills',
        children: skillsList.map((skill: string) => ({
          name: skill,
          type: 'skill-item'
        }))
      });
    }

    // 5. Projects
    const projectsSection = sections.find((s: any) => s.type === 'projects');
    const projectsItems = projectsSection?.content?.items || [];
    if (projectsItems && projectsItems.length > 0) {
      children.push({
        name: projectsSection?.content?.title || (isFr ? 'Projets' : 'Projects'),
        type: 'category-projects',
        children: projectsItems.map((item: any) => {
          const detailChildren: TreeNode[] = [];
          if (item.description) detailChildren.push({ name: item.description.length > 30 ? item.description.slice(0, 30) + '...' : item.description, type: 'detail-desc', details: item });
          
          return {
            name: item.name || item.title || (isFr ? 'Projet' : 'Project'),
            type: 'project-item',
            details: item,
            children: detailChildren.length > 0 ? detailChildren : undefined
          };
        })
      });
    }

    return {
      name: rootName,
      type: 'root',
      children
    };
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous renders
    d3.select(svgRef.current).selectAll('*').remove();

    const treeData = convertCVToTree();
    const width = 720;
    const height = 720;
    const radius = width / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `-${radius} -${radius} ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    // Add a responsive g container for zooming
    const g = svg.append('g')
      .attr('class', 'main-group');

    // Create D3 cluster layout
    const cluster = d3.cluster<TreeNode>()
      .size([360, radius - 150]); // 360 degrees, and inner radial boundary

    // Set hierarchy root
    const root = d3.hierarchy<TreeNode>(treeData);
    cluster(root);

    // Create dynamic theme color scale
    const getNodeColor = (type?: string) => {
      switch (type) {
        case 'root': return glowColor;
        case 'category-profile': return '#e11d48';
        case 'category-experience': return '#059669';
        case 'category-education': return '#d97706';
        case 'category-skills': return '#7c3aed';
        case 'category-projects': return '#2563eb';
        case 'experience-item': return '#34d399';
        case 'education-item': return '#fbbf24';
        case 'project-item': return '#60a5fa';
        case 'skill-item': return '#a78bfa';
        default: return editorTheme === 'dark' ? '#52525b' : '#a1a1aa';
      }
    };

    // Helper to calculate cartesian coords from polar (angle/radius)
    const project = (x: number, y: number) => {
      const angle = (x - 90) * Math.PI / 180;
      return [y * Math.cos(angle), y * Math.sin(angle)];
    };

    // Defs for filters (Glowing Neon Radial Links)
    const defs = svg.append('defs');
    
    // Create glow filter for Dark Mode
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    glowFilter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    // Draw custom links (curves connecting nodes)
    const linkGenerator = d3.linkRadial<any, any>()
      .angle((d: any) => d.x * Math.PI / 180)
      .radius((d: any) => d.y);

    const links = g.append('g')
      .attr('fill', 'none')
      .attr('stroke', editorTheme === 'dark' ? '#27272a' : '#e4e4e7')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', 1.8)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('class', 'link-path')
      .attr('d', linkGenerator as any)
      .style('transition', 'all 0.3s ease');

    // Create interactive nodes
    const node = g.append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', (d: any) => `translate(${project(d.x, d.y)})`)
      .attr('class', 'node-group')
      .style('cursor', 'pointer');

    // Node interactive circles
    node.append('circle')
      .attr('r', (d: any) => d.depth === 0 ? 10 : d.depth === 1 ? 7 : 5)
      .attr('fill', (d: any) => getNodeColor(d.data.type))
      .attr('stroke', editorTheme === 'dark' ? '#09090b' : '#ffffff')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease')
      .style('filter', editorTheme === 'dark' ? 'drop-shadow(0px 0px 4px rgba(59, 130, 246, 0.5))' : 'none');

    // Highlight path on hover
    node.on('mouseover', function(event, d) {
      d3.select(this).select('circle')
        .attr('r', d.depth === 0 ? 13 : d.depth === 1 ? 10 : 8)
        .attr('stroke', glowColor);

      // Highlight links in path
      const pathNodes = d.ancestors();
      links.attr('stroke', (l: any) => {
        if (pathNodes.includes(l.source) && pathNodes.includes(l.target)) {
          return getNodeColor(d.data.type);
        }
        return editorTheme === 'dark' ? '#18181b' : '#f4f4f5';
      })
      .attr('stroke-width', (l: any) => {
        if (pathNodes.includes(l.source) && pathNodes.includes(l.target)) {
          return 3.5;
        }
        return 1.2;
      });
    })
    .on('mouseout', function(event, d) {
      d3.select(this).select('circle')
        .attr('r', d.depth === 0 ? 10 : d.depth === 1 ? 7 : 5)
        .attr('stroke', editorTheme === 'dark' ? '#09090b' : '#ffffff');

      links
        .attr('stroke', editorTheme === 'dark' ? '#27272a' : '#e4e4e7')
        .attr('stroke-width', 1.8);
    })
    .on('click', (event, d) => {
      setSelectedNode(d.data);
    });

    // Elegant labels
    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', (d: any) => (d.x < 180 ? 10 : -10))
      .attr('text-anchor', (d: any) => (d.x < 180 ? 'start' : 'end'))
      .attr('transform', (d: any) => {
        if (d.depth === 0) return 'rotate(0) translate(-3, -15)';
        return `rotate(${d.x >= 180 ? d.x + 90 : d.x - 90})`;
      })
      .text((d: any) => {
        if (d.data.name.length > 22) {
          return d.data.name.slice(0, 20) + '...';
        }
        return d.data.name;
      })
      .attr('fill', editorTheme === 'dark' ? '#f4f4f5' : '#18181b')
      .style('font-size', (d: any) => d.depth === 0 ? '12px' : d.depth === 1 ? '10px' : '8.5px')
      .style('font-weight', (d: any) => d.depth <= 1 ? '700' : '400')
      .clone(true).lower()
      .attr('stroke', editorTheme === 'dark' ? '#09090b' : '#ffffff')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round');

    // Initial Zoom behaviour
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    d3.select(svgRef.current).call(zoomBehavior as any);

    // Apply current zoom state
    const currentZoom = d3.zoomTransform(svgRef.current);
    g.attr('transform', currentZoom.toString());

  }, [data, editorTheme, language, radarMode, glowColor]);

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(
      d3.zoom().scaleBy as any, 1.2
    );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(
      d3.zoom().scaleBy as any, 0.8
    );
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(
      d3.zoom().transform as any, d3.zoomIdentity
    );
    setSelectedNode(null);
  };

  const getNodeIcon = (type?: string) => {
    switch (type) {
      case 'root': return <User className="w-5 h-5 text-blue-500" />;
      case 'category-profile': return <User className="w-5 h-5 text-rose-500" />;
      case 'category-experience': return <Briefcase className="w-5 h-5 text-emerald-500" />;
      case 'category-education': return <GraduationCap className="w-5 h-5 text-amber-500" />;
      case 'category-skills': return <Award className="w-5 h-5 text-violet-500" />;
      case 'category-projects': return <FolderGit2 className="w-5 h-5 text-blue-500" />;
      default: return <Sparkles className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden flex flex-col h-full lg:min-h-[580px] shadow-2xl relative ${
      editorTheme === 'dark'
        ? 'bg-zinc-950 border-zinc-800/80 text-white'
        : 'bg-white border-zinc-200/90 text-zinc-900'
    }`} ref={containerRef} id="cv-radar-root">
      {/* Background radial accent flare */}
      <div className={`absolute inset-0 pointer-events-none opacity-25 mix-blend-screen transition-all duration-700 ${
        editorTheme === 'dark'
          ? 'bg-[radial-gradient(circle_at_50%_40%,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent'
          : 'bg-[radial-gradient(circle_at_50%_40%,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent'
      }`} />
      
      {/* Header Panel */}
      <div className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 ${
        editorTheme === 'dark' ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50/50'
      }`}>
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFr ? 'Visualisation Cognitive IA' : 'Cognitive AI Analysis'}</span>
          </div>
          <h3 className="text-base font-extrabold tracking-tight">
            {isFr ? 'Radar Sémantique du CV' : 'Semantic CV Radar'}
          </h3>
          <p className={`text-xs ${editorTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {isFr 
              ? 'Analysez la structure hiérarchique et les signaux cognitifs de votre profil.' 
              : 'Analyze the hierarchical structure and cognitive assets of your resume.'}
          </p>
        </div>

        {/* Dynamic Controls */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <button
            onClick={handleZoomIn}
            className={`p-2 rounded-xl border transition-all hover:scale-105 ${
              editorTheme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
            title="Zoom +"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className={`p-2 rounded-xl border transition-all hover:scale-105 ${
              editorTheme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
            title="Zoom -"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className={`p-2 rounded-xl border transition-all hover:scale-105 ${
              editorTheme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
            title={isFr ? 'Réinitialiser la vue' : 'Reset view'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main interactive visualization sandbox */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        
        {/* SVG Render Container */}
        <div className="flex-1 min-h-[420px] md:min-h-0 relative flex items-center justify-center p-4">
          <svg
            ref={svgRef}
            className="w-full h-full max-h-[580px] border rounded-2xl"
            style={{ pointerEvents: 'all', borderColor: '#000000' }}
          />

          {/* Quick interactive Hint */}
          <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-[10px] font-semibold ${
            editorTheme === 'dark' 
              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400' 
              : 'bg-white/85 border-zinc-200 text-zinc-500 shadow-sm'
          }`}>
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>{isFr ? 'Survolez pour tracer les chemins • Glissez pour naviguer' : 'Hover to trace paths • Drag/Pinch to zoom'}</span>
          </div>
        </div>

        {/* Live Detail Inspector Panel */}
        <div className={`w-full md:w-80 border-t md:border-t-0 md:border-l p-5 flex flex-col shrink-0 gap-4 text-left ${
          editorTheme === 'dark'
            ? 'bg-zinc-950/40 border-zinc-800'
            : 'bg-zinc-50/50 border-zinc-200'
        }`}>
          <div className="flex items-center gap-2">
            <Info className="w-4.5 h-4.5 text-blue-500" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              {isFr ? 'Inspecteur Cognitive' : 'Cognitive Inspector'}
            </h4>
          </div>

          {selectedNode ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  editorTheme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                }`}>
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 leading-tight">
                    {selectedNode.name}
                  </h5>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                    selectedNode.type?.startsWith('category') 
                      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                      : 'bg-zinc-500/10 text-zinc-500'
                  }`}>
                    {selectedNode.type || 'node'}
                  </span>
                </div>
              </div>

              {/* Dynamic details parsing */}
              {selectedNode.details ? (
                <div className={`p-4 rounded-xl border space-y-3 ${
                  editorTheme === 'dark' ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200'
                }`}>
                  {selectedNode.details.role && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{isFr ? 'Rôle' : 'Role'}</p>
                      <p className="text-xs font-semibold">{selectedNode.details.role}</p>
                    </div>
                  )}
                  {selectedNode.details.degree && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{isFr ? 'Diplôme' : 'Degree'}</p>
                      <p className="text-xs font-semibold">{selectedNode.details.degree}</p>
                    </div>
                  )}
                  {selectedNode.details.period && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{isFr ? 'Période' : 'Period'}</p>
                      <p className="text-xs font-semibold">{selectedNode.details.period}</p>
                    </div>
                  )}
                  {selectedNode.details.location && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{isFr ? 'Lieu' : 'Location'}</p>
                      <p className="text-xs font-semibold">{selectedNode.details.location}</p>
                    </div>
                  )}
                  {selectedNode.details.description && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{isFr ? 'Description' : 'Description'}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic border-l-2 border-blue-500 pl-2.5">
                        {selectedNode.details.description}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-4 rounded-xl border text-center ${
                  editorTheme === 'dark' ? 'bg-zinc-900/20 border-zinc-800/40' : 'bg-white/80 border-zinc-200'
                }`}>
                  <p className="text-xs text-zinc-500 italic">
                    {isFr 
                      ? 'Nœud structurel de navigation. Survolez ou sélectionnez un nœud de feuille pour afficher les données.'
                      : 'Structural navigation node. Hover or click leaf nodes to inspect details.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Eye className="w-8 h-8 text-zinc-400 animate-pulse" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  {isFr ? 'Aucun nœud inspecté' : 'No Node Selected'}
                </p>
                <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed mx-auto">
                  {isFr 
                    ? 'Cliquez sur n\'importe quel nœud ou texte dans le radar radial pour inspecter son contenu complet.' 
                    : 'Click on any node in the radial radar to inspect its complete contents.'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
