"use client";

import { useState } from "react";
import { Edit3, Loader2, Mail, Save, Shield, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/locales";

const t = <T extends { en: string; ar: string; fr: string }>(
  locale: Locale,
  text: T,
) => text[locale] ?? text.en;

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "SELLER" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "FLAGGED";
  createdAt: Date | string;
};

export function UserProfilePanel({
  locale,
  initialUser,
}: {
  locale: Locale;
  initialUser: UserProfile;
}) {
  const [user, setUser] = useState(initialUser);
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ label: string } | null>(
    null,
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPendingAction({
      label: t(locale, {
        en: "your profile",
        ar: "ملفك الشخصي",
        fr: "votre profil",
      }),
    });
  };

  const performSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, newPassword }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || `Status ${response.status}`);
      }

      const updated = payload?.data as UserProfile | undefined;
      if (updated) {
        setUser(updated);
        setName(updated.name);
        setEmail(updated.email);
      }
      setNewPassword("");
      setPendingAction(null);

      toast.success(
        t(locale, {
          en: "Profile updated.",
          ar: "تم تحديث الملف الشخصي.",
          fr: "Profil mis à jour.",
        }),
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(
        t(locale, {
          en: "Could not update the profile.",
          ar: "تعذر تحديث الملف الشخصي.",
          fr: "Impossible de mettre à jour le profil.",
        }),
      );
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const createdAtText = new Date(user.createdAt).toLocaleDateString(
    locale === "ar" ? "ar" : locale === "fr" ? "fr" : "en",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const statusText =
    locale === "ar"
      ? user.status === "ACTIVE"
        ? "نشط"
        : user.status === "PENDING"
          ? "قيد الانتظار"
          : "معلّم"
      : locale === "fr"
        ? user.status === "ACTIVE"
          ? "Actif"
          : user.status === "PENDING"
            ? "En attente"
            : "Signalé"
        : user.status;

  const roleText =
    locale === "ar"
      ? user.role === "USER"
        ? "مستخدم"
        : user.role === "SELLER"
          ? "بائع"
          : "مدير"
      : locale === "fr"
        ? user.role === "USER"
          ? "Utilisateur"
          : user.role === "SELLER"
            ? "Vendeur"
            : "Administrateur"
        : user.role;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle>
            {t(locale, { en: "Profile", ar: "الملف الشخصي", fr: "Profil" })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="profile-name"
                  className="flex items-center gap-2"
                >
                  <UserRound className="h-4 w-4 text-violet-500" />
                  {t(locale, { en: "Name", ar: "الاسم", fr: "Nom" })}
                </Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="profile-email"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-violet-500" />
                  {t(locale, {
                    en: "Email",
                    ar: "البريد الإلكتروني",
                    fr: "E-mail",
                  })}
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="profile-password"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4 text-violet-500" />
                {t(locale, {
                  en: "New password (optional)",
                  ar: "كلمة المرور الجديدة (اختياري)",
                  fr: "Nouveau mot de passe (facultatif)",
                })}
              </Label>
              <Input
                id="profile-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="h-11"
                placeholder={t(locale, {
                  en: "8+ characters",
                  ar: "8 أحرف أو أكثر",
                  fr: "8 caractères ou plus",
                })}
              />
              <p className="text-xs text-muted-foreground">
                {t(locale, {
                  en: "Leave empty if you don't want to change your password.",
                  ar: "اتركه فارغاً إذا لم ترغب في تغيير كلمة المرور.",
                  fr: "Laissez vide si vous ne souhaitez pas modifier votre mot de passe.",
                })}
              </p>
            </div>

            <Button type="submit" className="h-11 gap-2" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t(locale, {
                en: "Save changes",
                ar: "حفظ التغييرات",
                fr: "Enregistrer les modifications",
              })}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-linear-to-b from-card to-muted/20">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle>
            {t(locale, {
              en: "Account info",
              ar: "معلومات الحساب",
              fr: "Informations du compte",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6 text-sm">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-1 text-muted-foreground">
              {t(locale, { en: "Role", ar: "الدور", fr: "Rôle" })}
            </div>
            <div>
              <Badge variant={user.role === "ADMIN" ? "accent" : "secondary"}>
                {roleText}
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-1 text-muted-foreground">
              {t(locale, { en: "Status", ar: "الحالة", fr: "Statut" })}
            </div>
            <div>
              <Badge
                variant={user.status === "ACTIVE" ? "accent" : "secondary"}
              >
                {statusText}
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-1 text-muted-foreground">
              {t(locale, {
                en: "Created at",
                ar: "تاريخ الإنشاء",
                fr: "Créé le",
              })}
            </div>
            <div className="font-medium">{createdAtText}</div>
          </div>
        </CardContent>
      </Card>

      {pendingAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border/70 bg-card p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Edit3 className="h-6 w-6" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              {t(locale, {
                en: "Confirm update",
                ar: "تأكيد التحديث",
                fr: "Confirmer la mise à jour",
              })}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {locale === "ar"
                ? `هل تريد تحديث ${pendingAction.label}؟`
                : locale === "fr"
                  ? `Voulez-vous mettre à jour ${pendingAction.label} ?`
                  : `Do you want to update ${pendingAction.label}?`}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPendingAction(null)}
                className="gap-2"
                disabled={loading}
              >
                <X className="h-4 w-4" />
                {t(locale, { en: "Cancel", ar: "إلغاء", fr: "Annuler" })}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void performSave();
                }}
                className="gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t(locale, {
                      en: "Updating...",
                      ar: "جارٍ التحديث...",
                      fr: "Mise à jour...",
                    })}
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    {t(locale, {
                      en: "Update",
                      ar: "تحديث",
                      fr: "Mettre à jour",
                    })}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
