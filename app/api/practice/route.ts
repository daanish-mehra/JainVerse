import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/cosmos";

const userId = "default-user";

const defaultPractices = [
  {
    id: 1,
    icon: "🌅",
    title: "Morning Prayer",
    titleJain: "प्रातःकाल प्रार्थना",
    time: "6:30 AM",
    status: "completed",
    description: "Recite the Navkar Mantra and other daily prayers.",
  },
  {
    id: 2,
    icon: "🧘",
    title: "Meditation",
    titleJain: "ध्यान",
    time: "7:00 AM - Reminder in 10 min",
    status: "pending",
    description: "Practice 15 minutes of mindful meditation.",
  },
  {
    id: 3,
    icon: "📖",
    title: "Scripture Reading",
    titleJain: "शास्त्र पठन",
    time: "8:00 AM",
    status: "scheduled",
    description: "Read a chapter from Tattvarth Sutra.",
  },
  {
    id: 4,
    icon: "🍽️",
    title: "Fasting: Ekasan",
    titleJain: "एकासन",
    time: "Next meal: 6:00 PM",
    status: "active",
    description: "Observe Ekasan (one meal a day) today.",
  },
];

const mockVratas = [
  {
    id: 1,
    name: "Ekasan Vrata",
    day: 0,
    totalDays: 30,
    progress: 0,
    description: "A vow to eat only one meal a day.",
  },
  {
    id: 2,
    name: "Chauvihar Vrata",
    day: 0,
    totalDays: 30,
    progress: 0,
    description: "A vow to abstain from food and water after sunset.",
  },
];

const mockFastingSchedule = [
  { day: "Mon", type: "Ekasan" },
  { day: "Tue", type: "Biasan" },
  { day: "Wed", type: "Chauvihar" },
  { day: "Thu", type: "Ekasan" },
  { day: "Fri", type: "Biasan" },
  { day: "Sat", type: "Chauvihar" },
  { day: "Sun", type: "Ekasan" },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  try {
    if (type === "practices") {
      const container = await getContainer("practices");
      let practices = defaultPractices;

      if (container) {
        try {
          const practiceId = `${userId}-${date}`;
          const { resource: practiceData } = await container.item(practiceId, practiceId).read().catch(() => ({
            resource: null,
          }));

          if (practiceData && practiceData.practices) {
            practices = practiceData.practices;
          }
        } catch (error) {
          console.warn("Failed to fetch practices:", error);
        }
      }

      return NextResponse.json({
        date,
        practices,
      });
    }

    if (type === "vratas") {
      const container = await getContainer("vratas");
      let vratas = mockVratas;

      if (container) {
        try {
          const { resources } = await container.items.query({
            query: "SELECT * FROM c WHERE c.userId = @userId",
            parameters: [{ name: "@userId", value: userId }],
          }).fetchAll();

          if (resources.length > 0) {
            vratas = resources.map((v: any) => {
              const startDate = new Date(v.startDate);
              const now = new Date();
              const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
              const day = Math.max(0, Math.min(daysDiff, v.totalDays));
              const progress = v.totalDays > 0 ? Math.round((day / v.totalDays) * 100) : 0;

              return {
                id: v.id,
                name: v.name,
                day,
                totalDays: v.totalDays,
                progress,
                description: v.description || "",
              };
            });
          }
        } catch (error) {
          console.warn("Failed to fetch vratas:", error);
        }
      }

      return NextResponse.json({
        vratas,
      });
    }

    if (type === "fasting") {
      const container = await getContainer("fastingSchedule");
      let schedule = mockFastingSchedule;

      if (container) {
        try {
          const scheduleId = `${userId}-current`;
          const { resource: scheduleData } = await container.item(scheduleId, scheduleId).read().catch(() => ({
            resource: null,
          }));

          if (scheduleData && scheduleData.schedule) {
            schedule = scheduleData.schedule;
          }
        } catch (error) {
          console.warn("Failed to fetch fasting schedule:", error);
        }
      }

      return NextResponse.json({
        schedule,
      });
    }

    if (type === "progress") {
      const container = await getContainer("userProgress");
      let progress = {
        streak: 0,
        totalPractices: 0,
        vratasCompleted: 0,
        thisMonth: 0,
      };

      if (container) {
        try {
          const { resource: progressData } = await container.item(userId, userId).read().catch(() => ({
            resource: null,
          }));

          if (progressData) {
            const now = new Date();
            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            
            const practicesThisMonth = (progressData.practiceHistory || []).filter((p: any) => {
              const practiceDate = new Date(p.date);
              return practiceDate >= thisMonthStart;
            }).length;

            progress = {
              streak: progressData.practiceStreak || 0,
              totalPractices: progressData.totalPracticesCompleted || 0,
              vratasCompleted: progressData.vratasCompleted || 0,
              thisMonth: practicesThisMonth,
            };
          }
        } catch (error) {
          console.warn("Failed to fetch progress:", error);
        }
      }

      return NextResponse.json(progress);
    }

    return NextResponse.json({
      practices: defaultPractices,
      vratas: mockVratas,
      fastingSchedule: mockFastingSchedule,
    });
  } catch (error) {
    console.error("Practice API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, practiceId, vrataId, reflection, completed, date } = body;

    if (action === "complete-practice") {
      if (!practiceId) {
        return NextResponse.json(
          { error: "Practice ID is required" },
          { status: 400 }
        );
      }

      const practiceDate = date || new Date().toISOString().split("T")[0];
      const container = await getContainer("practices");
      const progressContainer = await getContainer("userProgress");

      if (container) {
        try {
          const practiceDateId = `${userId}-${practiceDate}`;
          let { resource: practiceData } = await container.item(practiceDateId, practiceDateId).read().catch(() => ({
            resource: null,
          }));

          if (!practiceData) {
            practiceData = {
              id: practiceDateId,
              userId,
              date: practiceDate,
              practices: defaultPractices,
            };
          }

          const practices = practiceData.practices.map((p: any) =>
            p.id === practiceId ? { ...p, status: completed !== false ? "completed" : "pending" } : p
          );

          practiceData.practices = practices;
          await container.items.upsert(practiceData);
        } catch (error) {
          console.error("Failed to update practice:", error);
        }
      }

      if (progressContainer) {
        try {
          let { resource: progressData } = await progressContainer.item(userId, userId).read().catch(() => ({
            resource: null,
          }));

          if (!progressData) {
            progressData = {
              id: userId,
              totalPracticesCompleted: 0,
              practiceStreak: 0,
              practiceHistory: [],
              vratasCompleted: 0,
            };
          }

          if (completed !== false) {
            progressData.totalPracticesCompleted = (progressData.totalPracticesCompleted || 0) + 1;
            
            if (!progressData.practiceHistory) {
              progressData.practiceHistory = [];
            }

            const today = new Date().toISOString().split("T")[0];
            const todayExists = progressData.practiceHistory.some((h: any) => h.date === today);

            if (!todayExists) {
              progressData.practiceHistory.push({
                date: today,
                practicesCompleted: 1,
              });

              const sortedHistory = progressData.practiceHistory
                .map((h: any) => new Date(h.date).getTime())
                .sort((a: number, b: number) => b - a);

              let streak = 1;
              const todayTime = new Date(today).getTime();
              for (let i = 0; i < sortedHistory.length; i++) {
                const expectedDate = todayTime - i * 24 * 60 * 60 * 1000;
                if (sortedHistory[i] === expectedDate) {
                  streak = i + 1;
                } else {
                  break;
                }
              }

              progressData.practiceStreak = streak;
            }

            await progressContainer.items.upsert(progressData);
          }
        } catch (error) {
          console.error("Failed to update progress:", error);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Practice marked as completed",
        practiceId,
        completed: completed !== false,
      });
    }

    if (action === "update-vrata") {
      if (!vrataId) {
        return NextResponse.json(
          { error: "Vrata ID is required" },
          { status: 400 }
        );
      }

      const container = await getContainer("vratas");
      if (container) {
        try {
          const { resource: vrata } = await container.item(vrataId, vrataId).read().catch(() => ({
            resource: null,
          }));

          if (vrata) {
            await container.items.upsert(vrata);
          }
        } catch (error) {
          console.error("Failed to update vrata:", error);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Vrata updated successfully",
        vrataId,
      });
    }

    if (action === "add-reflection") {
      if (!reflection) {
        return NextResponse.json(
          { error: "Reflection text is required" },
          { status: 400 }
        );
      }

      const container = await getContainer("reflections");
      const reflectionDate = date || new Date().toISOString().split("T")[0];

      if (container) {
        try {
          const reflectionId = `${userId}-${reflectionDate}`;
          const reflectionData = {
            id: reflectionId,
            userId,
            date: reflectionDate,
            text: reflection,
            createdAt: new Date().toISOString(),
          };

          await container.items.upsert(reflectionData);
        } catch (error) {
          console.error("Failed to save reflection:", error);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Reflection saved successfully",
        reflection: {
          id: Date.now(),
          text: reflection,
          date: reflectionDate,
        },
      });
    }

    if (action === "update-fasting-schedule") {
      const { schedule } = body;
      if (!schedule || !Array.isArray(schedule)) {
        return NextResponse.json(
          { error: "Schedule array is required" },
          { status: 400 }
        );
      }

      const container = await getContainer("fastingSchedule");
      if (container) {
        try {
          const scheduleId = `${userId}-current`;
          const scheduleData = {
            id: scheduleId,
            userId,
            schedule,
            updatedAt: new Date().toISOString(),
          };

          await container.items.upsert(scheduleData);
        } catch (error) {
          console.error("Failed to update fasting schedule:", error);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Fasting schedule updated successfully",
        schedule,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Practice API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
