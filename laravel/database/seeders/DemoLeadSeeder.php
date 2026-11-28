<?php

namespace Database\Seeders;

use App\Models\Lead;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoLeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * STRICT SAFETY RULE: Demo data can only ever be seeded locally.
     */
    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command->error('STRICT SAFETY VIOLATION: Demo data can NEVER be seeded in production.');

            return;
        }

        $demoLeads = [
            [
                'lead_code' => 'DEMO-'.Str::upper(Str::random(6)),
                'name' => 'Aarav Sharma',
                'email' => 'aarav.sharma@delhi-retail.in',
                'phone' => '+919811223344',
                'whatsapp' => '+919811223344',
                'company' => 'Delhi Retail Innovations',
                'city' => 'New Delhi',
                'industry' => 'E-Commerce / D2C',
                'interested_service' => 'Meta Advantage+ Scaling',
                'message' => 'Looking to scale D2C apparel brand from ₹15L to ₹50L/mo with positive unit economics.',
                'budget' => '₹50,000 - ₹1,00,000/mo',
                'source' => 'Website Inbound',
                'utm_source' => 'google',
                'utm_medium' => 'cpc',
                'utm_campaign' => 'delhi_d2c_performance',
                'status' => 'new',
                'stage' => 'lead',
                'is_test' => false,
                'created_at' => now()->subHours(2),
            ],
            [
                'lead_code' => 'DEMO-'.Str::upper(Str::random(6)),
                'name' => 'Pooja Verma',
                'email' => 'pooja@fintechgrowth.co',
                'phone' => '+919871122334',
                'whatsapp' => '+919871122334',
                'company' => 'Fintech Growth Labs',
                'city' => 'Gurugram',
                'industry' => 'Fintech / SaaS',
                'interested_service' => 'Performance Marketing Sprint',
                'message' => 'Need high converting landing pages and Meta/Google attribution setup.',
                'budget' => '₹1,00,000+/mo',
                'source' => 'Case Study Work Page',
                'utm_source' => 'linkedin',
                'utm_medium' => 'social',
                'utm_campaign' => 'fintech_case_study',
                'status' => 'contacted',
                'stage' => 'contacted',
                'is_test' => false,
                'created_at' => now()->subDays(1),
            ],
            [
                'lead_code' => 'DEMO-'.Str::upper(Str::random(6)),
                'name' => 'Rohan Mehta',
                'email' => 'rohan@mehtalogistics.in',
                'phone' => '+919910022334',
                'whatsapp' => '+919910022334',
                'company' => 'Mehta Express Logistics',
                'city' => 'Noida',
                'industry' => 'B2B Logistics',
                'interested_service' => 'B2B Lead Generation & SEO',
                'message' => 'Require B2B enterprise inbound enquiries across North India.',
                'budget' => '₹35,000 - ₹50,000/mo',
                'source' => 'Google Search',
                'utm_source' => 'google',
                'utm_medium' => 'organic',
                'status' => 'qualified',
                'stage' => 'qualified',
                'is_test' => false,
                'created_at' => now()->subDays(3),
            ],
        ];

        foreach ($demoLeads as $lead) {
            Lead::firstOrCreate(
                ['email' => $lead['email']],
                $lead
            );
        }

        $this->command->info('Seeded 3 realistic demo leads into local database.');
    }
}
