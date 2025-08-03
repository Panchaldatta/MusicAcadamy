
import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClassroomSwipes } from '@/hooks/useClassroomSwipes';
import { filterClassroomsByKeywords, CLASSROOM_KEYWORDS } from '@/utils/classroomKeywords';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchFilters from './classroom/SearchFilters';
import StackedClassroomCards from './classroom/StackedClassroomCards';
import SwipeProgress from './classroom/SwipeProgress';
import EmptyState from './classroom/EmptyState';
import EnrollmentDialog from './EnrollmentDialog';
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface SwipeableClassroomViewProps {
  classrooms: Classroom[];
}

const SwipeableClassroomView: React.FC<SwipeableClassroomViewProps> = ({ classrooms }) => {
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  const { toast } = useToast();
  
  const {
    swipeHistory,
    likedClassrooms,
    passedClassrooms,
    getSwipedClassroomIds
  } = useClassroomSwipes();

  const filteredClassrooms = useMemo(() => {
    const swipedIds = getSwipedClassroomIds();
    let filtered = classrooms.filter(classroom => !swipedIds.includes(classroom.id));
    
    if (searchKeywords.length > 0) {
      filtered = filterClassroomsByKeywords(filtered, searchKeywords);
    }
    
    if (priceFilter !== 'all') {
      filtered = filtered.filter(classroom => {
        switch (priceFilter) {
          case 'low': return classroom.price <= 500;
          case 'medium': return classroom.price > 500 && classroom.price <= 1500;
          case 'high': return classroom.price > 1500;
          default: return true;
        }
      });
    }
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter(classroom => classroom.level.toLowerCase() === levelFilter);
    }
    
    return filtered;
  }, [classrooms, searchKeywords, priceFilter, levelFilter, swipeHistory]);

  const popularKeywords = Object.keys(CLASSROOM_KEYWORDS).slice(0, 6);
  const hasActiveFilters = searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all';

  const addKeyword = (keyword: string) => {
    if (!searchKeywords.includes(keyword)) {
      setSearchKeywords(prev => [...prev, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    setSearchKeywords(prev => prev.filter(k => k !== keyword));
  };

  const handleKeywordInputSubmit = () => {
    if (keywordInput.trim()) {
      addKeyword(keywordInput.trim());
      setKeywordInput('');
    }
  };

  const resetAllFilters = () => {
    setSearchKeywords([]);
    setPriceFilter('all');
    setLevelFilter('all');
    setShowFilters(false);
  };

  if (filteredClassrooms.length === 0) {
    return (
      <>
        <div className="w-full max-w-md mx-auto mb-4 sm:mb-6 px-4 sm:px-0">
          <SearchFilters
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            searchKeywords={searchKeywords}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            onAddKeyword={handleKeywordInputSubmit}
            onRemoveKeyword={removeKeyword}
            onAddPopularKeyword={addKeyword}
            onResetFilters={resetAllFilters}
            popularKeywords={popularKeywords}
          />
        </div>
        <EmptyState
          hasFilters={hasActiveFilters}
          likedCount={likedClassrooms.length}
          passedCount={passedClassrooms.length}
          onResetFilters={resetAllFilters}
        />
      </>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      <SearchFilters
        keywordInput={keywordInput}
        setKeywordInput={setKeywordInput}
        searchKeywords={searchKeywords}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        onAddKeyword={handleKeywordInputSubmit}
        onRemoveKeyword={removeKeyword}
        onAddPopularKeyword={addKeyword}
        onResetFilters={resetAllFilters}
        popularKeywords={popularKeywords}
      />

      <StackedClassroomCards 
        classrooms={filteredClassrooms}
        maxVisible={3}
      />

      <SwipeProgress
        currentIndex={0}
        totalClassrooms={filteredClassrooms.length}
        isFiltered={hasActiveFilters}
        likedCount={likedClassrooms.length}
        passedCount={passedClassrooms.length}
        onResetFilters={resetAllFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Show enrollment button for liked classes */}
      {likedClassrooms.length > 0 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-green-800 text-lg">
              💚 Your Liked Classes ({likedClassrooms.length})
            </h3>
            <Badge className="bg-green-600 text-white">Ready to Enroll</Badge>
          </div>
          <p className="text-green-700 text-sm mb-4">
            Great choices! These are the classes you've liked. You can now enroll and start your learning journey.
          </p>
          
          {/* Liked Classes Grid */}
          <div className="grid gap-4">
            {likedClassrooms.map((classroom, index) => (
              <div 
                key={classroom.id}
                className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{classroom.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {classroom.description || `Learn ${classroom.subject} with expert guidance`}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded">📅 {classroom.duration_weeks} weeks</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">👥 Max {classroom.capacity} students</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">📊 {classroom.level}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-green-600">₹{classroom.price}</span>
                      <span className="text-sm text-gray-500">
                        ({classroom.sessions_per_week}x per week)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      onClick={() => {
                        const confirmEnrollment = window.confirm(
                          `Enroll in "${classroom.name}" for ₹${classroom.price}?\n\nDuration: ${classroom.duration_weeks} weeks\nSessions: ${classroom.sessions_per_week}x per week\nLevel: ${classroom.level}`
                        );
                        
                        if (confirmEnrollment) {
                          toast({
                            title: "🎉 Enrollment Successful!",
                            description: `You've been enrolled in "${classroom.name}". Check your email for class details.`,
                          });
                        }
                      }}
                    >
                      💳 Pay & Enroll (₹{classroom.price})
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-green-200 text-green-600 hover:bg-green-50 w-full sm:w-auto"
                    >
                      📋 View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              💡 <strong>Total Value:</strong> ₹{likedClassrooms.reduce((sum, c) => sum + c.price, 0)} for {likedClassrooms.length} course{likedClassrooms.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Enrollment Dialog - Keep for backward compatibility */}
      <EnrollmentDialog
        isOpen={showEnrollmentDialog}
        onClose={() => setShowEnrollmentDialog(false)}
        classroom={selectedClassroom}
      />
    </div>
  );
};

export default SwipeableClassroomView;
