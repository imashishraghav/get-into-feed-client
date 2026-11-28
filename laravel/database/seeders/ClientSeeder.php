<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            ['name' => 'Airtel', 'industry' => 'Telecom & 5G', 'website_url' => 'https://airtel.in'],
            ['name' => 'Bajaj Finserv', 'industry' => 'FinTech & NBFC', 'website_url' => 'https://bajajfinserv.in'],
            ['name' => 'Apollo Diagnostics', 'industry' => 'Healthcare & Diagnostics', 'website_url' => 'https://apollodiagnostics.in'],
            ['name' => 'PolicyBazaar', 'industry' => 'InsurTech', 'website_url' => 'https://policybazaar.com'],
            ['name' => 'Urban Company', 'industry' => 'Consumer Home Services', 'website_url' => 'https://urbancompany.com'],
            ['name' => 'Nykaa Fashion', 'industry' => 'D2C Fashion & Beauty', 'website_url' => 'https://nykaa.com'],
            ['name' => 'Mamaearth', 'industry' => 'Organic Personal Care', 'website_url' => 'https://mamaearth.in'],
            ['name' => 'CarDekho', 'industry' => 'AutoTech Marketplace', 'website_url' => 'https://cardekho.com'],
            ['name' => 'Tata 1mg', 'industry' => 'ePharmacy & Telehealth', 'website_url' => 'https://1mg.com'],
        ];

        foreach ($clients as $index => $c) {
            Client::updateOrCreate(
                ['name' => $c['name']],
                [
                    'industry' => $c['industry'],
                    'website_url' => $c['website_url'],
                    'sort_order' => $index + 1,
                    'status' => 'published',
                ]
            );
        }
    }
}
