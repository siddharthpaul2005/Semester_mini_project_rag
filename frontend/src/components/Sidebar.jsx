import React from 'react';
import { NavLink } from 'react-router-dom';
import { UploadCloud, MessageSquare, BookOpen, BarChart3, GraduationCap } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const navItems = [
        { name: 'Upload Material', path: '/', icon: UploadCloud },
        { name: 'AI Tutor', path: '/tutor', icon: MessageSquare },
        { name: 'Quiz', path: '/quiz', icon: BookOpen },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    ];

    return (
        <div className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col pt-6 font-medium shadow-2xl z-10 flex-shrink-0">
            <div className="flex items-center gap-3 px-6 mb-10 text-white">
                <GraduationCap className="w-9 h-9 text-indigo-400" />
                <h1 className="text-xl font-bold tracking-wider">AI Tutor</h1>
            </div>
            <nav className="flex flex-col gap-2 px-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-md relative"
                                    : "hover:bg-slate-800 hover:text-white"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto p-6 text-xs text-slate-500 text-center border-t border-slate-800">
                AI Tutor App &copy; {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default Sidebar;
