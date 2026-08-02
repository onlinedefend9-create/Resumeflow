import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useCVData } from '../../hooks/useCVData';
import { useLanguage } from '../../i18n/LanguageContext';
import { ZoomIn, ZoomOut, RotateCcw, Award, Briefcase, GraduationCap, User, FolderGit2, Sparkles, HelpCircle, Eye, Info, ChevronRight, ChevronDown } from 'lucide-react';

interface TreeNode {
  name: string;
  type?: string;
  details?: any;
  children?: TreeNode[];
  _children?: TreeNode[]; // Hidden children when collapsed
}

export const CVStructureVisualizer = () => {
  const { data, editorTheme } = useCVData();
  const { language } = useLanguage();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [glowColor, setGlowColor] = useState('#3b82f6');
  
  // Track collapsed node paths to persist across renders
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());

  const isFr = language === 'fr';

  useEffect(() => {
    if (data?.theme?.primaryColor) {
      setGlowColor(data.theme.primaryColor);
    }
  }, [data?.theme?.primaryColor]);

  // Helper to get a unique path key for a node to track its collapsed state
  const getNodePathKey = (name: string, type?: string, parentName?: string): string => {
    return `${parentName || 'root'}->${type || 'node'}->${name}`;
  };

  // Convert CV data into a beautiful hierarchical tree, respecting the collapsedPaths state
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
      const categoryName = isFr ? 'Profil Personnel' : 'Personal Profile';
      const type = 'category-profile';
      const key = getNodePathKey(categoryName, type, rootName);
      
      const node: TreeNode = {
        name: categoryName,
        type: type,
      };

      if (collapsedPaths.has(key)) {
        node._children = profileChildren;
      } else {
        node.children = profileChildren;
      }
      children.push(node);
    }

    // 2. Experience
    const expSection = sections.find((s: any) => s.type === 'experience');
    const expItems = expSection?.content?.items || [];
    if (expItems.length > 0) {
      const categoryName = expSection?.content?.title || (isFr ? 'Expériences' : 'Experience');
      const type = 'category-experience';
      const key = getNodePathKey(categoryName, type, rootName);

      const expChildren = expItems.map((item: any) => {
        const detailChildren: TreeNode[] = [];
        if (item.role) detailChildren.push({ name: item.role, type: 'detail-role' });
        if (item.period) detailChildren.push({ name: item.period, type: 'detail-period' });
        if (item.location) detailChildren.push({ name: item.location, type: 'detail-location' });
        
        const itemName = item.company || (isFr ? 'Entreprise' : 'Company');
        const itemType = 'experience-item';
        const itemKey = getNodePathKey(itemName, itemType, categoryName);

        const expItemNode: TreeNode = {
          name: itemName,
          type: itemType,
          details: item,
        };

        if (detailChildren.length > 0) {
          if (collapsedPaths.has(itemKey)) {
            expItemNode._children = detailChildren;
          } else {
            expItemNode.children = detailChildren;
          }
        }

        return expItemNode;
      });

      const expNode: TreeNode = {
        name: categoryName,
        type: type,
      };

      if (collapsedPaths.has(key)) {
        expNode._children = expChildren;
      } else {
        expNode.children = expChildren;
      }
      children.push(expNode);
    }

    // 3. Education
    const eduSection = sections.find((s: any) => s.type === 'education');
    const eduItems = eduSection?.content?.items || [];
    if (eduItems.length > 0) {
      const categoryName = eduSection?.content?.title || (isFr ? 'Formations' : 'Education');
      const type = 'category-education';
      const key = getNodePathKey(categoryName, type, rootName);

      const eduChildren = eduItems.map((item: any) => {
        const detailChildren: TreeNode[] = [];
        if (item.degree) detailChildren.push({ name: item.degree, type: 'detail-degree' });
        if (item.period) detailChildren.push({ name: item.period, type: 'detail-period' });
        
        const itemName = item.school || (isFr ? 'Établissement' : 'School');
        const itemType = 'education-item';
        const itemKey = getNodePathKey(itemName, itemType, categoryName);

        const eduItemNode: TreeNode = {
          name: itemName,
          type: itemType,
          details: item,
        };

        if (detailChildren.length > 0) {
          if (collapsedPaths.has(itemKey)) {
            eduItemNode._children = detailChildren;
          } else {
            eduItemNode.children = detailChildren;
          }
        }

        return eduItemNode;
      });

      const eduNode: TreeNode = {
        name: categoryName,
        type: type,
      };

      if (collapsedPaths.has(key)) {
        eduNode._children = eduChildren;
      } else {
        eduNode.children = eduChildren;
      }
      children.push(eduNode);
    }

    // 4. Skills
    const skillsSection = sections.find((s: any) => s.type === 'skills');
    const skillsList = skillsSection?.content?.skillsList || [];
    if (skillsList.length > 0) {
      const categoryName = skillsSection?.content?.title || (isFr ? 'Compétences' : 'Skills');
      const type = 'category-skills';
      const key = getNodePathKey(categoryName, type, rootName);

      const skillChildren = skillsList.map((skill: string) => ({
        name: skill,
        type: 'skill-item'
      }));

      const skillsNode: TreeNode = {
        name: categoryName,
        type: type,
      };

      if (collapsedPaths.has(key)) {
        skillsNode._children = skillChildren;
      } else {
        skillsNode.children = skillChildren;
      }
      children.push(skillsNode);
    }

    // 5. Projects
    const projectsSection = sections.find((s: any) => s.type === 'projects');
    const projectsItems = projectsSection?.content?.items || [];
    if (projectsItems && projectsItems.length > 0) {
      const categoryName = projectsSection?.content?.title || (isFr ? 'Projets' : 'Projects');
      const type = 'category-projects';
      const key = getNodePathKey(categoryName, type, rootName);

      const projectChildren = projectsItems.map((item: any) => {
        const detailChildren: TreeNode[] = [];
        if (item.description) detailChildren.push({ name: item.description.length > 30 ? item.description.slice(0, 30) + '...' : item.description, type: 'detail-desc', details: item });
        
        const itemName = item.name || item.title || (isFr ? 'Projet' : 'Project');
        const itemType = 'project-item';
        const itemKey = getNodePathKey(itemName, itemType, categoryName);

        const projectItemNode: TreeNode = {
          name: itemName,
          type: itemType,
          details: item,
        };

        if (detailChildren.length > 0) {
          if (collapsedPaths.has(itemKey)) {
            projectItemNode._children = detailChildren;
          } else {
            projectItemNode.children = detailChildren;
          }
        }

        return projectItemNode;
      });

      const projectsNode: TreeNode = {
        name: categoryName,
        type: type,
      };

      if (collapsedPaths.has(key)) {
        projectsNode._children = projectChildren;
      } else {
        projectsNode.children = projectChildren;
      }
      children.push(projectsNode);
    }

    const rootNode: TreeNode = {
      name: rootName,
      type: 'root',
    };

    const rootKey = getNodePathKey(rootName, 'root');
    if (collapsedPaths.has(rootKey)) {
      rootNode._children = children;
    } else {
      rootNode.children = children;
    }

    return rootNode;
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
      .attr('id', 'glow-viz')
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

    const initialLinkGenerator = d3.linkRadial<any, any>()
      .angle((d: any) => d.x * Math.PI / 180)
      .radius((d: any) => 0); // Start everything centered at 0 radius

    const links = g.append('g')
      .attr('fill', 'none')
      .attr('stroke', editorTheme === 'dark' ? '#27272a' : '#e4e4e7')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1.8)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('class', 'link-path')
      .attr('d', initialLinkGenerator as any);

    // Smooth outward burst transition for link paths
    links.transition()
      .duration(850)
      .ease(d3.easeCubicOut)
      .attr('d', linkGenerator as any)
      .attr('stroke-opacity', 0.8);

    // Create interactive nodes starting centered and invisible
    const node = g.append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', 'translate(0, 0)')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .style('opacity', 0);

    // Transition each node container to its destination radial coordinates
    node.transition()
      .duration(850)
      .ease(d3.easeCubicOut)
      .attr('transform', (d: any) => `translate(${project(d.x, d.y)})`)
      .style('opacity', 1);

    // Node interactive circles
    node.append('circle')
      .attr('r', (d: any) => d.depth === 0 ? 11 : d.depth === 1 ? 8 : 5.5)
      .attr('fill', (d: any) => getNodeColor(d.data.type))
      .attr('stroke', (d: any) => {
        // Indicate if collapsible/expandable
        const hasChildren = d.data.children && d.data.children.length > 0;
        const hasHiddenChildren = d.data._children && d.data._children.length > 0;
        if (hasChildren) {
          return glowColor;
        } else if (hasHiddenChildren) {
          return '#3b82f6';
        }
        return editorTheme === 'dark' ? '#09090b' : '#ffffff';
      })
      .attr('stroke-width', (d: any) => {
        const hasChildren = d.data.children && d.data.children.length > 0;
        const hasHiddenChildren = d.data._children && d.data._children.length > 0;
        return (hasChildren || hasHiddenChildren) ? 3 : 2;
      })
      .style('transition', 'all 0.3s ease')
      .style('filter', editorTheme === 'dark' ? 'drop-shadow(0px 0px 4px rgba(59, 130, 246, 0.4))' : 'none');

    // Add visual indicator inside expandable nodes
    node.filter((d: any) => (d.data.children && d.data.children.length > 0) || (d.data._children && d.data._children.length > 0))
      .append('circle')
      .attr('r', 2)
      .attr('fill', '#ffffff');

    // Highlight path on hover
    node.on('mouseover', function(event, d) {
      d3.select(this).select('circle')
        .attr('r', d.depth === 0 ? 14 : d.depth === 1 ? 11 : 8)
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
        .attr('r', d.depth === 0 ? 11 : d.depth === 1 ? 8 : 5.5)
        .attr('stroke', (x: any) => {
          const hasChildren = x.data.children && x.data.children.length > 0;
          const hasHiddenChildren = x.data._children && x.data._children.length > 0;
          if (hasChildren) return glowColor;
          if (hasHiddenChildren) return '#3b82f6';
          return editorTheme === 'dark' ? '#09090b' : '#ffffff';
        });

      links
        .attr('stroke', editorTheme === 'dark' ? '#27272a' : '#e4e4e7')
        .attr('stroke-width', 1.8);
    })
    .on('click', (event, d) => {
      // Toggle expand/collapse on node click if it has children or hidden children
      const nodeName = d.data.name;
      const nodeType = d.data.type;
      const parentName = d.parent ? d.parent.data.name : undefined;
      const key = getNodePathKey(nodeName, nodeType, parentName);

      const hasChildren = d.data.children && d.data.children.length > 0;
      const hasHiddenChildren = d.data._children && d.data._children.length > 0;

      if (hasChildren || hasHiddenChildren) {
        setCollapsedPaths(prev => {
          const next = new Set(prev);
          if (next.has(key)) {
            next.delete(key);
          } else {
            next.add(key);
          }
          return next;
        });
      }

      setSelectedNode(d.data);
    });

    // Elegant labels
    const textGroup = node.append('text')
      .attr('dy', '0.31em')
      .attr('x', (d: any) => (d.x < 180 ? 12 : -12))
      .attr('text-anchor', (d: any) => (d.x < 180 ? 'start' : 'end'))
      .attr('transform', (d: any) => {
        if (d.depth === 0) return 'rotate(0) translate(-3, -16)';
        return `rotate(${d.x >= 180 ? d.x + 90 : d.x - 90})`;
      })
      .text((d: any) => {
        // Append collapse marker to labels
        const hasHidden = d.data._children && d.data._children.length > 0;
        const marker = hasHidden ? ' (+)' : '';
        const baseName = d.data.name;
        if (baseName.length > 22) {
          return baseName.slice(0, 20) + '...' + marker;
        }
        return baseName + marker;
      })
      .attr('fill', editorTheme === 'dark' ? '#f4f4f5' : '#18181b')
      .style('font-size', (d: any) => d.depth === 0 ? '12px' : d.depth === 1 ? '10px' : '8.5px')
      .style('font-weight', (d: any) => d.depth <= 1 ? '700' : '400')
      .style('opacity', 0);

    textGroup.clone(true).lower()
      .attr('stroke', editorTheme === 'dark' ? '#09090b' : '#ffffff')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round');

    // Fade in text labels beautifully with a micro delay
    node.selectAll('text')
      .transition()
      .delay(180)
      .duration(600)
      .style('opacity', 1);

    // Initial Zoom behaviour
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    d3.select(svgRef.current).call(zoomBehavior as any);

    // Apply current zoom state
    const currentZoom = d3.zoomTransform(svgRef.current);
    g.attr('transform', currentZoom.toString());

  }, [data, editorTheme, language, collapsedPaths, glowColor]);

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(
      d3.zoom().scaleBy as any, 1.3
    );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(
      d3.zoom().scaleBy as any, 0.7
    );
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(
      d3.zoom().transform as any, d3.zoomIdentity
    );
    setSelectedNode(null);
  };

  const handleExpandAll = () => {
    setCollapsedPaths(new Set());
  };

  const handleCollapseAll = () => {
    const rootName = data?.sections?.find((s: any) => s.type === 'header')?.content?.fullName || (isFr ? 'Votre CV' : 'Your Resume');
    const newCollapsed = new Set<string>();
    
    // Auto collapse primary categories
    newCollapsed.add(getNodePathKey(isFr ? 'Profil Personnel' : 'Personal Profile', 'category-profile', rootName));
    newCollapsed.add(getNodePathKey(isFr ? 'Expériences' : 'Experience', 'category-experience', rootName));
    newCollapsed.add(getNodePathKey(isFr ? 'Formations' : 'Education', 'category-education', rootName));
    newCollapsed.add(getNodePathKey(isFr ? 'Compétences' : 'Skills', 'category-skills', rootName));
    newCollapsed.add(getNodePathKey(isFr ? 'Projets' : 'Projects', 'category-projects', rootName));

    setCollapsedPaths(newCollapsed);
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
    <div className={`rounded-2xl border transition-all overflow-hidden flex flex-col h-full lg:min-h-[600px] shadow-2xl relative ${
      editorTheme === 'dark'
        ? 'bg-zinc-950 border-zinc-800/80 text-white'
        : 'bg-white border-zinc-200/90 text-zinc-900'
    }`} ref={containerRef} id="cv-structure-root">
      {/* Background soft glow effect */}
      <div className={`absolute inset-0 pointer-events-none opacity-20 mix-blend-screen transition-all duration-700 ${
        editorTheme === 'dark'
          ? 'bg-[radial-gradient(circle_at_50%_40%,_var(--tw-gradient-stops))] from-blue-950/25 via-transparent to-transparent'
          : 'bg-[radial-gradient(circle_at_50%_40%,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent'
      }`} />
      
      {/* Visualizer Header Panel */}
      <div className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 relative z-10 ${
        editorTheme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-zinc-200/80 bg-zinc-50/50'
      }`}>
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFr ? 'Dendrogramme Interactif' : 'Interactive Dendrogram'}</span>
          </div>
          <h3 className="text-base font-extrabold tracking-tight">
            {isFr ? 'Visualiseur Structurel du CV' : 'CV Structure Visualizer'}
          </h3>
          <p className={`text-xs ${editorTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {isFr 
              ? 'Explorez et déployez l\'architecture sémantique de votre profil en un clic.' 
              : 'Explore and expand your resume\'s architectural blueprint dynamically.'}
          </p>
        </div>

        {/* Global Expand / Collapse Control bar */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <button
            onClick={handleExpandAll}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all hover:scale-105 cursor-pointer ${
              editorTheme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-900'
            }`}
          >
            {isFr ? 'Tout Déplier' : 'Expand All'}
          </button>
          <button
            onClick={handleCollapseAll}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all hover:scale-105 cursor-pointer ${
              editorTheme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-900'
            }`}
          >
            {isFr ? 'Tout Replier' : 'Collapse All'}
          </button>
          
          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

          {/* Zoom Actions */}
          <button
            onClick={handleZoomIn}
            className={`p-1.5 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
              editorTheme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
            title="Zoom +"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className={`p-1.5 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
              editorTheme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
            title="Zoom -"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className={`p-1.5 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
              editorTheme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
            title={isFr ? 'Réinitialiser la vue' : 'Reset view'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Sandbox Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative z-10">
        
        {/* SVG Area */}
        <div className="flex-1 min-h-[440px] md:min-h-0 relative flex items-center justify-center p-4">
          <svg
            ref={svgRef}
            className="w-full h-full max-h-[580px]"
            style={{ pointerEvents: 'all' }}
          />

          {/* Interactive hints */}
          <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-[10px] font-semibold ${
            editorTheme === 'dark' 
              ? 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400' 
              : 'bg-white/90 border-zinc-200 text-zinc-500 shadow-sm'
          }`}>
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {isFr 
                ? 'Clic Nœud : Déplier / Replier • Clic Texte : Inspecter • Glisser : Naviguer' 
                : 'Click Node: Expand/Collapse • Click Text: Inspect • Drag: Pan/Zoom'}
            </span>
          </div>
        </div>

        {/* Cognitive Detail Panel */}
        <div className={`w-full md:w-80 border-t md:border-t-0 md:border-l p-5 flex flex-col shrink-0 gap-4 text-left ${
          editorTheme === 'dark'
            ? 'bg-zinc-950/50 border-zinc-800/80'
            : 'bg-zinc-50/70 border-zinc-200/80'
        }`}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {isFr ? 'Données Structurelles' : 'Structural Blueprint'}
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

              {/* Collapsed / Expanded Status badge */}
              {(selectedNode.children || selectedNode._children) && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                  editorTheme === 'dark' ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-white border-zinc-200'
                }`}>
                  {selectedNode.children ? (
                    <>
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">
                        {isFr ? 'Section dépliée' : 'Section expanded'} ({selectedNode.children.length})
                      </span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">
                        {isFr ? 'Section repliée' : 'Section collapsed'} ({selectedNode._children?.length})
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Leaf elements parsing */}
              {selectedNode.details ? (
                <div className={`p-4 rounded-xl border space-y-3 ${
                  editorTheme === 'dark' ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white border-zinc-200'
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
                  <p className="text-xs text-zinc-500 italic leading-relaxed">
                    {isFr 
                      ? 'Nœud de structure principal. Cliquez sur un nœud pour le déplier ou le replier dynamiquement.'
                      : 'Main hierarchical group node. Click node to expand or collapse details.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Eye className="w-8 h-8 text-zinc-400 dark:text-zinc-500 animate-pulse" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  {isFr ? 'Aucune sélection' : 'No Node Selected'}
                </p>
                <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed mx-auto">
                  {isFr 
                    ? 'Cliquez sur n\'importe quel nœud pour le déplier, ou sur son texte pour inspecter ses informations complètes.' 
                    : 'Click any circle node to expand/collapse, or click its label text to view full data.'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
