"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Download, Share2, Play, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stories = [
  {
    id: 1,
    title: "The Story of Mahavira",
    age: "5-10 years",
    rating: 4.8,
    pages: 10,
    theme: "Philosophy",
  },
  {
    id: 2,
    title: "The Value of Ahimsa",
    age: "2-5 years",
    rating: 4.9,
    pages: 8,
    theme: "Ahimsa",
  },
  {
    id: 3,
    title: "The Journey of Non-Violence",
    age: "10-15 years",
    rating: 4.7,
    pages: 15,
    theme: "Ahimsa",
  },
];

const characters = [
  { id: 1, name: "Mahavira", icon: "👤" },
  { id: 2, name: "Parshvanatha", icon: "👤" },
  { id: 3, name: "Rishabhanatha", icon: "👤" },
];

export default function StoriesPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("2-5");
  const [selectedTheme, setSelectedTheme] = useState("Ahimsa");
  const [selectedStyle, setSelectedStyle] = useState("friendly");

  const handleGenerateStory = () => {
    // TODO: Implement story generation with Azure OpenAI
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-saffron-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">📖 Stories</h1>
          <Button variant="outline" size="sm" className="text-saffron-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">🎯 Story Library</h2>
          <div className="space-y-3">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="card-hover border-saffron-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">📖 {story.title}</h3>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>🎯 Age: {story.age}</span>
                          <span>⭐ {story.rating}/5</span>
                          <span>📚 {story.pages} pages</span>
                          <span>🎨 Theme: {story.theme}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Listen
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                ✨ Create Story
              </CardTitle>
              <CardDescription>Generate AI-powered Jain stories for different age groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">🎯 Age Group</label>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="w-full h-11 px-4 py-2 rounded-xl border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="2-5">2-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10-15">10-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">📝 Theme</label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full h-11 px-4 py-2 rounded-xl border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="Ahimsa">Ahimsa</option>
                  <option value="Karma">Karma</option>
                  <option value="Anekantvad">Anekantvad</option>
                  <option value="Aparigraha">Aparigraha</option>
                  <option value="Philosophy">Philosophy</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">🎨 Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full h-11 px-4 py-2 rounded-xl border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="friendly">Friendly</option>
                  <option value="educational">Educational</option>
                  <option value="adventure">Adventure</option>
                  <option value="moral">Moral</option>
                </select>
              </div>
              <Button
                onClick={handleGenerateStory}
                className="w-full bg-gradient-saffron hover:shadow-spiritual"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Story
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">🎨 Characters</h2>
          <div className="grid grid-cols-3 gap-3">
            {characters.map((character) => (
              <Card key={character.id} className="card-hover text-center">
                <CardContent className="p-4">
                  <div className="text-4xl mb-2">{character.icon}</div>
                  <p className="text-sm font-medium">{character.name}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="card-hover text-center border-dashed border-2 border-saffron-200">
              <CardContent className="p-4 flex items-center justify-center h-full">
                <Button variant="ghost" className="flex flex-col items-center space-y-2">
                  <Users className="w-6 h-6 text-saffron-600" />
                  <span className="text-xs">Create Character</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">📊 My Stories</h2>
          <div className="space-y-3">
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">📖 My First Story</h3>
                    <p className="text-xs text-muted-foreground mt-1">Created 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">📖 The Journey of Ahimsa</h3>
                    <p className="text-xs text-muted-foreground mt-1">Created 5 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Button variant="outline" className="w-full">
              View All Stories
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

