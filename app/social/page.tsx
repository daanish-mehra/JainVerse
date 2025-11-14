"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, BarChart3, Calendar, Settings, Eye, Heart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const contentLibrary = [
  {
    id: 1,
    title: "What is Ahimsa?",
    platform: "TikTok Reel",
    views: "1.2K",
    likes: "245",
    engagement: "8.5%",
  },
  {
    id: 2,
    title: "Jain Principles Explained",
    platform: "YouTube Short",
    views: "5.3K",
    likes: "892",
    engagement: "12.3%",
  },
  {
    id: 3,
    title: "Meditation Tips",
    platform: "Instagram Reel",
    views: "3.1K",
    likes: "567",
    engagement: "9.8%",
  },
];

const analytics = {
  totalViews: "12.5K",
  totalLikes: "2.1K",
  engagement: "8.5%",
  topTopic: "Ahimsa",
};

export default function SocialPage() {
  const [selectedTopic, setSelectedTopic] = useState("Ahimsa");
  const [selectedPlatform, setSelectedPlatform] = useState("TikTok");
  const [selectedStyle, setSelectedStyle] = useState("educational");

  const handleGenerateContent = () => {
    // TODO: Implement social media content generation with Azure OpenAI
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-saffron-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">📱 Social Media</h1>
          <Button variant="ghost" size="sm" className="text-saffron-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Video className="w-5 h-5 mr-2" />
                🎬 Create Content
              </CardTitle>
              <CardDescription>Generate AI-powered social media content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">📝 Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full h-11 px-4 py-2 rounded-xl border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="Ahimsa">Ahimsa</option>
                  <option value="Karma">Karma</option>
                  <option value="Anekantvad">Anekantvad</option>
                  <option value="Aparigraha">Aparigraha</option>
                  <option value="Meditation">Meditation</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">🎯 Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full h-11 px-4 py-2 rounded-xl border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube Short</option>
                  <option value="Instagram">Instagram Reel</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">🎨 Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full h-11 px-4 py-2 rounded-xl border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="educational">Educational</option>
                  <option value="entertaining">Entertaining</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="informative">Informative</option>
                </select>
              </div>
              <Button
                onClick={handleGenerateContent}
                className="w-full bg-gradient-saffron hover:shadow-spiritual"
              >
                <Video className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">📊 Content Library</h2>
          <div className="space-y-3">
            {contentLibrary.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <Card className="card-hover border-saffron-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">🎬 {content.title}</h3>
                        <span className="text-xs bg-saffron-100 text-saffron-700 px-2 py-1 rounded-full">
                          {content.platform}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="flex items-center space-x-1 text-sm">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-muted-foreground">{content.views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Heart className="w-4 h-4 text-red-600" />
                        <span className="text-muted-foreground">{content.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-muted-foreground">{content.engagement}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-green-50 text-green-700 border-green-200">
                        Publish
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
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                📈 Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Total Views:</span>
                </div>
                <span className="text-blue-600 font-bold text-lg">{analytics.totalViews}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">Total Likes:</span>
                </div>
                <span className="text-red-600 font-bold text-lg">{analytics.totalLikes}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Engagement:</span>
                </div>
                <span className="text-green-600 font-bold text-lg">{analytics.engagement}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎯</span>
                  <span className="font-semibold">Top Topic:</span>
                </div>
                <span className="text-saffron-600 font-bold">{analytics.topTopic}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                ⏰ Scheduled Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-sm font-medium">📅 Today:</span>
                  <span className="text-saffron-600 font-semibold">2 posts scheduled</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-sm font-medium">📅 This Week:</span>
                  <span className="text-saffron-600 font-semibold">10 posts</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

